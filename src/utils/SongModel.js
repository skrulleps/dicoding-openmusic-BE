const songModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  // eslint-disable-next-line camelcase
  album_id,
  // eslint-disable-next-line camelcase
  created_at,
  // eslint-disable-next-line camelcase
  updated_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id, // eslint-disable-line camelcase
  createdAt: created_at, // eslint-disable-line camelcase
  updatedAt: updated_at, // eslint-disable-line camelcase
});

module.exports = { songModel };