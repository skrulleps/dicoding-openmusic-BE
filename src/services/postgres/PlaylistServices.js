const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistServices {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistsByOwner(owner) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist({ playlistId, songId, userId }) {
    // Verify playlist exists and user owns it
    await this.verifyPlaylistOwner(playlistId, userId);

    // Verify song exists
    await this.verifySongExists(songId);

    // Check if song already exists in playlist
    const existingSong = await this.checkSongInPlaylist(playlistId, songId);
    console.log(existingSong);
    if (existingSong) {
      throw new InvariantError('Lagu sudah ada dalam playlist');
    }

    // Add song to playlist
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }

    return true;
  }

  async verifySongExists(songId) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return true;
  }

  async checkSongInPlaylist(playlistId, songId) {
    const query = {
      text: 'SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async getPlaylistSongs(playlistId, userId) {
    // Verify playlist exists and user owns it
    await this.verifyPlaylistOwner(playlistId, userId);

    // Get playlist details with owner username
    const playlistQuery = {
      text: `
        SELECT p.id, p.name, u.username 
        FROM playlists p
        JOIN users u ON p.owner = u.id
        WHERE p.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    // Get songs in the playlist
    const songsQuery = {
      text: `
        SELECT s.id, s.title, s.performer 
        FROM playlist_songs ps
        JOIN songs s ON ps.song_id = s.id
        WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };
  }

  async deleteSongFromPlaylist({ playlistId, songId, userId }) {
    // Verify playlist exists and user owns it
    await this.verifyPlaylistOwner(playlistId, userId);

    // Verify song exists in playlist
    const songExists = await this.checkSongInPlaylist(playlistId, songId);
    if (!songExists) {
      throw new NotFoundError('Lagu tidak ditemukan dalam playlist');
    }

    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }

    return result.rows[0].id;
  }
}

module.exports = PlaylistServices;
