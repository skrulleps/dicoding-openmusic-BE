const autoBind = require('auto-bind');
const { NotFoundError } = require('../../exceptions/NotFoundError');
const StorageService = require('../../services/storage/StorageService');
const CacheService = require('../../services/redis/CacheService');

class AlbumsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
    this._storageService = new StorageService();
    this._cacheService = new CacheService();
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._services.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const { title, performer } = request.query;

    let searchQuery = null;
    if (title || performer) {
      searchQuery = title || performer;
    }

    const album = await this._services.getAlbumById(albumId, searchQuery);

    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    const { albumId } = request.params;
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    await this._services.editAlbumById(albumId, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { cover } = request.payload;

    if (!cover) {
      throw new Error('Cover image is required');
    }

    // Validate file type
    this._validator.validateCoverUpload(cover.hapi.headers);

    const { id } = request.params;

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

    await this._services.updateAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._services.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._services.addAlbumLike(albumId, userId);

    // Clear cache for this album's likes
    const cacheKey = `album-likes:${albumId}`;
    await this._cacheService.delete(cacheKey);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    // eslint-disable-next-line no-useless-catch
    try {
      // Try to get from cache first
      const cacheKey = `album-likes:${albumId}`;
      const cachedLikes = await this._cacheService.get(cacheKey);

      if (cachedLikes !== null) {
        // Return cached data with custom header
        const response = h.response({
          status: 'success',
          data: {
            likes: parseInt(cachedLikes, 10),
          },
        });
        response.header('X-Data-Source', 'cache');
        return response;
      }

      // If not in cache, get from database
      const likes = await this._services.getAlbumLikes(albumId);

      // Cache the result for 30 minutes (1800 seconds)
      await this._cacheService.set(cacheKey, likes.toString(), 1800);

      return {
        status: 'success',
        data: {
          likes,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._services.removeAlbumLike(albumId, userId);

    // Clear cache for this album's likes
    const cacheKey = `album-likes:${albumId}`;
    await this._cacheService.delete(cacheKey);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
