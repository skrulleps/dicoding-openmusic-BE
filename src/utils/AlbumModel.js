const AlbumModel = ({
  id,
  name,
  year,
  cover_url, // eslint-disable-line camelcase
  created_at, // eslint-disable-line camelcase
  updated_at, // eslint-disable-line camelcase
}) => ({
  id,
  name,
  year,
  coverUrl: cover_url || null, // eslint-disable-line camelcase
  createdAt: created_at, // eslint-disable-line camelcase
  updatedAt: updated_at, // eslint-disable-line camelcase
});

module.exports = AlbumModel;
