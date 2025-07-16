const AlbumModel = ({
  id,
  name,
  year,
  created_at, // eslint-disable-line camelcase
  updated_at, // eslint-disable-line camelcase
}) => ({
  id,
  name,
  year,
  createdAt: created_at, // eslint-disable-line camelcase
  updatedAt: updated_at, // eslint-disable-line camelcase
});

module.exports = AlbumModel;
