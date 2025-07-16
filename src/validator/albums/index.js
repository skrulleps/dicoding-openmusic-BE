const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('../../validator/albums/schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = AlbumValidator;