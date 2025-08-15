const nanoid = (...args) => import('nanoid').then((mod) => mod.nanoid(...args));
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const AlbumModel = require('../../utils/AlbumModel');

class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = await nanoid(8);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id, searchQuery = null) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = result.rows.map(AlbumModel)[0];

    // Fetch songs for the album with optional search
    let songsQuery;
    if (searchQuery) {
      songsQuery = {
        text: 'SELECT * FROM songs WHERE album_id = $1 AND (title ILIKE $2 OR performer ILIKE $2)',
        values: [id, `%${searchQuery}%`],
      };
    } else {
      songsQuery = {
        text: 'SELECT * FROM songs WHERE album_id = $1',
        values: [id],
      };
    }

    const songsResult = await this._pool.query(songsQuery);

    const songs = songsResult.rows.map((row) => ({
      id: row.id,
      title: row.title,
      performer: row.performer,
    }));

    album.songs = songs;

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async updateAlbumCover(id, coverUrl) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui sampul album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumLike(albumId, userId) {
    // Check if album exists first
    const albumQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const albumResult = await this._pool.query(albumQuery);
    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const id = await nanoid(8);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, albumId, userId, createdAt],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Anda sudah menyukai album ini');
      }
      throw error;
    }
  }

  async removeAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Like tidak ditemukan');
    }
  }

  async getAlbumLikes(albumId) {
    // Check if album exists
    const albumQuery = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [albumId],
    };

    const albumResult = await this._pool.query(albumQuery);
    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    // Get likes count
    const likesQuery = {
      text: 'SELECT COUNT(*) as likes FROM album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const likesResult = await this._pool.query(likesQuery);
    const likes = parseInt(likesResult.rows[0].likes, 10);

    return likes;
  }

  async isAlbumLikedByUser(albumId, userId) {
    const query = {
      text: 'SELECT id FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }
}

module.exports = AlbumServices;
