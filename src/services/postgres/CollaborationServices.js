const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationServices {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId, ownerId) {
    // Verify playlist exists and user owns it
    await this.verifyPlaylistOwner(playlistId, ownerId);

    // Verify user exists
    await this.verifyUserExists(userId);

    // Check if user is already a collaborator
    const existingCollaboration = await this.checkExistingCollaboration(
      playlistId,
      userId
    );
    if (existingCollaboration) {
      throw new InvariantError(
        'User sudah menjadi kolaborator pada playlist ini'
      );
    }

    // Check if user is the owner
    const isOwner = await this.checkIfOwner(playlistId, userId);
    if (isOwner) {
      throw new InvariantError(
        'User adalah pemilik playlist dan tidak dapat ditambahkan sebagai kolaborator'
      );
    }

    const id = `collaboration-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId, ownerId) {
    // Verify playlist exists and user owns it
    await this.verifyPlaylistOwner(playlistId, ownerId);

    // Verify collaboration exists
    const collaboration = await this.checkExistingCollaboration(
      playlistId,
      userId
    );
    if (!collaboration) {
      throw new NotFoundError('Kolaborasi tidak ditemukan');
    }

    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    return result.rows[0].id;
  }

  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyUserExists(userId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async checkExistingCollaboration(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  async checkIfOwner(playlistId, userId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0 && result.rows[0].owner === userId;
  }

  async getCollaboratorsByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT u.id, u.username
        FROM collaborations c
        JOIN users u ON c.user_id = u.id
        WHERE c.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylistAccess(playlistId, userId) {
    // Check if user is owner
    const ownerQuery = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const ownerResult = await this._pool.query(ownerQuery);
    if (ownerResult.rows.length > 0 && ownerResult.rows[0].owner === userId) {
      return true;
    }

    // Check if user is collaborator
    const collaboratorQuery = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const collaboratorResult = await this._pool.query(collaboratorQuery);
    return collaboratorResult.rows.length > 0;
  }
}

module.exports = CollaborationServices;
