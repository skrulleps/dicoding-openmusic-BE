require('dotenv').config();
const Hapi = require('@hapi/hapi');


const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 5000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();