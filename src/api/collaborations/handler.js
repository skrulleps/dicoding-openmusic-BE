const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationService, playlistService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;

      const collaborationId = await this._collaborationService.addCollaboration(
        playlistId,
        userId,
        owner
      );

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statusCode || 400);
      }
      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._collaborationService.deleteCollaboration(
        playlistId,
        userId,
        owner
      );

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: error.message,
          })
          .code(error.statusCode || 400);
      }
      console.error(error);
      return h
        .response({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        })
        .code(500);
    }
  }
}

module.exports = CollaborationsHandler;
