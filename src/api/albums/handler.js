const autoBind = require('auto-bind');
const { NotFoundError } = require('../../exceptions/NotFoundError');

class AlbumsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
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

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;

    await this._services.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
