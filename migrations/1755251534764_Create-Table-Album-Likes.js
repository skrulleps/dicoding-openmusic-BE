exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: { // eslint-disable-line camelcase
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: { // eslint-disable-line camelcase
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: { // eslint-disable-line camelcase
      type: 'TEXT',
      notNull: true,
    },
  });

  // Add foreign key constraints
  pgm.addConstraint('album_likes', 'fk_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  pgm.addConstraint('album_likes', 'fk_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // Add unique constraint to prevent duplicate likes
  pgm.addConstraint('album_likes', 'unique_album_user', 'UNIQUE(album_id, user_id)');
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
