const autoBind = require('auto-bind');

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { title, year, genre, performer, duration, albumId } = request.payload;

        const songId = this._service.addSong({ title, year, genre, performer, duration, albumId });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
        });
        response.code(201);
        return response;
    }

    // get all songs
    getSongsHandler(request) {
        const { title, performer } = request.query;
        const songs = this._service.getSongs({ title, performer });

        return {
            status: 'success',
            data: {
                songs: songs.map(song => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer,
                })),
            },
        };
    }

    // get song by id
    getSongByIdHandler(request) {
        const { id } = request.params;
        const song = this._service.getSongById(id);

        return {
            status: 'success',
            data: {
                song,
            },
        };
    }

    // put song by id
    putSongByIdHandler(request) {
        const { id } = request.params;
        this._validator.validateSongPayload(request.payload);
        const updatedAt = new Date().toISOString();
        const { title, year, genre, performer, duration, albumId } = request.payload;

        this._service.editSongById(id, { title, year, genre, performer, duration, albumId, updatedAt });

        return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
        };
    }

    // delete song by id
    deleteSongByIdHandler(request) {
        const { id } = request.params;
        this._service.deleteSongById(id);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
        };
    }
};

module.exports = SongsHandler;