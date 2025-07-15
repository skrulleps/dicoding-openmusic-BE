const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums/{albumId}',
        handler: handler.getAlbumsByIdHandler,
    },
    {
        method: 'PUT',
        path: '/albums/{albumId}',
        handler: handler.putAlbumByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/albums/{albumId}',
        handler: handler.deleteAlbumByIdHandler,
    }
]