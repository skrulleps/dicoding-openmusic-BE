const nanoid = (...args) => import('nanoid').then((mod) => mod.nanoid(...args));
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { songModel } = require('../../utils/SongModel');

class SongsHandler {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(8);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query = 'SELECT * FROM songs';
    const values = [];
    const conditions = [];

    if (title) {
      conditions.push(`LOWER(title) LIKE LOWER($${values.length + 1})`);
      values.push(`%${title}%`);
    }
    if (performer) {
      conditions.push(`LOWER(performer) LIKE LOWER($${values.length + 1})`);
      values.push(`%${performer}%`);
    }
    if (conditions.length > 0) {
      query += ` WHERE ${  conditions.join(' AND ')}`;
    }

    console.log('getSongs query:', query);
    console.log('getSongs values:', values);

    const result = await this._pool.query({ text: query, values });

    return result.rows.map(songModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    console.log('Raw DB result for getSongById:', result.rows);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const song = result.rows.map(songModel)[0];

    console.log('Mapped song object:', song);

    return song;
  }

  async updateSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0].id;
  }
}

module.exports = SongsHandler;