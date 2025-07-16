# Hapi Album Song API

This project is a backend service built with Hapi.js for managing albums and songs. It provides a RESTful API to perform CRUD operations on albums and songs stored in a PostgreSQL database.

## Features

- Manage albums with attributes such as name and year.
- Manage songs with attributes such as title, year, performer, genre, duration, and optional album association.
- Database migrations for setting up albums and songs tables.
- Environment-based configuration for server host and port.
- Input validation and error handling (using Joi and custom exceptions).
- ID generation using nanoid.
- Improved asynchronous handling in API handlers to ensure proper Promise resolution.
- Fixed SQL query parameterization for filtering songs by title and performer.
- Corrected import and usage of songModel function for proper data mapping.
- Added songs array in album details response to include associated songs.
- Updated song payload validation schema to make albumId optional.


## Technologies Used

- [Hapi.js](https://hapi.dev/) - Node.js framework for building APIs
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [node-pg-migrate](https://github.com/salsita/node-pg-migrate) - Database migration tool
- [Joi](https://joi.dev/) - Data validation
- [nanoid](https://github.com/ai/nanoid) - Unique ID generation
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd hapi-album-song
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the environment variables as needed (see below).

## Environment Variables

The project uses the following environment variables (can be set in `.env` file):

- `PORT` - The port number the server will listen on (default: 5000)
- `HOST` - The host address the server will bind to (default: localhost)

Example `.env` file:

```
PORT=5000
HOST=localhost
```

## Database Setup

This project uses PostgreSQL as the database. To set up the database schema, run the migrations:

```bash
npm run migrate
```

To rollback the last migration:

```bash
npm run migrate:down
```

To create a new migration:

```bash
npm run migrate:create -- <migration-name>
```

## Running the Server

For development with automatic reload on changes:

```bash
npm run serve
```

For production:

```bash
npm run start:prod
```

The server will start and listen on the configured host and port.

## Project Structure

```
.
├── migrations/                  # Database migration files
│   ├── 1752564620108_table-albums.js
│   └── 1752564634309_table-songs.js
├── src/
│   ├── api/                    # API route handlers
│   ├── exceptions/             # Custom error classes
│   ├── services/               # Business logic and database services
│   ├── utils/                  # Utility modules and models
│   ├── validator/              # Input validation schemas
│   └── server.js               # Server initialization
├── .env                       # Environment variables file (not committed)
├── package.json               # Project metadata and scripts
└── README.md                  # Project documentation
```

## License

This project is licensed under the ISC License.
