class ExportHandler {
  constructor(service, validator, playlistService) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;

    // Check if playlist exists and user has access
    await this._playlistService.verifyPlaylistAccess(playlistId, request.auth.credentials.id);

    const message = {
      userId: request.auth.credentials.id,
      playlistId: playlistId,
      targetEmail: request.payload.targetEmail,
    };
    console.log('Export message:', message);
    this._service.sendMessage('export:playlist', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    }).code(201);
  }
}

module.exports = ExportHandler;