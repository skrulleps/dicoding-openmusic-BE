# 🎵 Hapi Album & Song API

A comprehensive RESTful API built with **Hapi.js** for managing music albums, songs, playlists, and user collaborations. This backend service provides a complete music management system with authentication, authorization, and collaborative features.

## 🚀 Features

### Core Features

- **Album Management**: CRUD operations for music albums with name, year, and cover attributes
- **Song Management**: Complete song management with title, year, performer, genre, duration, and optional album association
- **User Management**: User registration and authentication system
- **JWT Authentication**: Secure token-based authentication
- **Playlist Management**: Create, manage, and share music playlists
- **Collaborative Playlists**: Add collaborators to playlists for shared management
- **Playlist Activities**: Track all activities (add/remove songs) within playlists
- **Input Validation**: Comprehensive request validation using Joi
- **Error Handling**: Custom error handling with meaningful responses

### Advanced Features

- **Database Migrations**: Automated database schema management
- **PostgreSQL Integration**: Robust relational database with proper constraints
- **CORS Support**: Cross-origin resource sharing enabled
- **Environment Configuration**: Flexible environment-based configuration
- **ESLint Integration**: Code quality and style enforcement
- **Auto-reload**: Development server with nodemon

## 🛠️ Technology Stack

### Backend Framework

- **Hapi.js** (^21.4.0) - Node.js framework for building APIs
- **@hapi/jwt** (^3.2.0) - JWT authentication plugin

### Database

- **PostgreSQL** - Primary relational database
- **node-pg-migrate** (^8.0.3) - Database migration management
- **pg** (^8.16.3) - PostgreSQL client for Node.js

### Security & Validation

- **bcrypt** (^6.0.0) - Password hashing
- **joi** (^17.13.3) - Data validation and schema definition
- **nanoid** (^5.1.5) - Unique ID generation

### Development Tools

- **nodemon** (^3.1.10) - Development server with auto-reload
- **eslint** (^9.31.0) - Code linting and formatting

## 📊 Database Schema

### Tables Overview

1. **users** - User accounts with authentication
2. **albums** - Music albums information
3. **songs** - Individual song details with optional album association
4. **playlists** - User-created playlists
5. **playlist_songs** - Junction table for playlist-song relationships
6. **authentications** - JWT token storage
7. **collaborations** - Playlist sharing and collaboration
8. **playlist_activities** - Activity tracking for playlists

### Detailed Schema

#### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL
);
```

#### Albums Table

```sql
CREATE TABLE albums (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### Songs Table

```sql
CREATE TABLE songs (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  performer TEXT NOT NULL,
  genre TEXT NOT NULL,
  duration INTEGER,
  album_id VARCHAR(50) REFERENCES albums(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### Playlists Table

```sql
CREATE TABLE playlists (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  owner VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

#### Playlist Songs (Junction)

```sql
CREATE TABLE playlist_songs (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id VARCHAR(50) NOT NULL REFERENCES songs(id) ON DELETE CASCADE
);
```

## 🚀 API Endpoints

### Album Endpoints

- `POST /albums` - Create new album
- `GET /albums/{albumId}` - Get album by ID
- `PUT /albums/{albumId}` - Update album
- `DELETE /albums/{albumId}` - Delete album

### Song Endpoints

- `POST /songs` - Create new song
- `GET /songs` - Get all songs (with optional filtering)
- `GET /songs/{id}` - Get song by ID
- `PUT /songs/{id}` - Update song
- `DELETE /songs/{id}` - Delete song

### User Endpoints

- `POST /users` - Register new user

### Authentication Endpoints

- `POST /authentications` - Login and get JWT token
- `PUT /authentications` - Refresh JWT token
- `DELETE /authentications` - Logout and invalidate token

### Playlist Endpoints

- `POST /playlists` - Create new playlist (Auth required)
- `GET /playlists` - Get user's playlists (Auth required)
- `DELETE /playlists/{id}` - Delete playlist (Auth required)
- `POST /playlists/{id}/songs` - Add song to playlist (Auth required)
- `GET /playlists/{id}/songs` - Get playlist songs (Auth required)
- `DELETE /playlists/{id}/songs` - Remove song from playlist (Auth required)
- `GET /playlists/{id}/activities` - Get playlist activities (Auth required)

### Collaboration Endpoints

- `POST /collaborations` - Add collaborator to playlist (Auth required)
- `DELETE /collaborations` - Remove collaborator from playlist (Auth required)

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hapi-album-song
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
HOST=localhost

# Database Configuration
PGUSER=your_username
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=openmusic
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=your_secret_key
REFRESH_TOKEN_KEY=your_refresh_secret
ACCESS_TOKEN_AGE=1800
```

### 4. Database Setup

```bash
# Create database
createdb openmusic

# Run migrations
npm run migrate

# For development with auto-reload
npm run start

# For production
npm run start:prod
```

## 🗄️ Database Setup

### Using node-pg-migrate

```bash
# Create new migration
npm run migrate:create -- <migration-name>

# Run all pending migrations
npm run migrate

# Rollback last migration
npm run migrate:down
```

### Manual Database Setup

```sql
-- Create database
CREATE DATABASE openmusic;

-- Grant permissions (adjust as needed)
GRANT ALL PRIVILEGES ON DATABASE openmusic TO your_username;
```

## 🧪 Development

### Available Scripts

- `npm start` - Start development server with nodemon
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run migrate` - Run database migrations

### Development Workflow

1. Start PostgreSQL service
2. Create and configure database
3. Run migrations
4. Start development server
5. Test endpoints using tools like Postman or curl

## 📁 Project Structure

```
hapi-album-song/
├── migrations/                  # Database migration files
│   ├── 1752564620108_table-albums.js
│   ├── 1752564634309_table-songs.js
│   ├── 1752733725724_create-table-users.js
│   ├── 1754293630010_Table-playlist.js
│   ├── 1754293780476_Table-junc-playlist-songs.js
│   ├── 1754300049384_Table-Authentications.js
│   ├── 1754360753548_Table-Collaborations.js
│   └── 1754362283206_Table-Playlist-Activities.js
├── src/
│   ├── api/                    # API route handlers
│   │   ├── albums/            # Album endpoints
│   │   ├── songs/             # Song endpoints
│   │   ├── users/             # User endpoints
│   │   ├── authentications/   # Authentication endpoints
│   │   ├── playlists/         # Playlist endpoints
│   │   └── collaborations/    # Collaboration endpoints
│   ├── services/              # Business logic and database services
│   │   └── postgres/          # PostgreSQL service implementations
│   ├── exceptions/             # Custom error classes
│   ├── validator/              # Input validation schemas
│   ├── tokenize/               # JWT token management
│   ├── utils/                  # Utility modules
│   └── server.js               # Server initialization
├── .env.example               # Environment variables template
├── package.json               # Project dependencies and scripts
├── eslint.config.js           # ESLint configuration
└── README.md                  # Project documentation
```

## 🔐 Authentication & Authorization

### JWT Token Usage

- **Access Token**: Used for API authentication
- **Refresh Token**: Used to obtain new access tokens
- **Token Expiration**: Configurable via environment variables

### Protected Endpoints

All playlist and collaboration endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### User Roles

- **Owner**: Full control over their playlists
- **Collaborator**: Can add/remove songs from shared playlists

## 🧪 Testing

### Manual Testing

Use tools like Postman, Insomnia, or curl to test the endpoints:

```bash
# Register a new user
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass","fullname":"Test User"}'

# Login to get token
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### Example API Usage

```bash
# Create an album
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -d '{"name":"Awesome Album","year":2024}'

# Create a song
curl -X POST http://localhost:5000/songs \
  -H "Content-Type: application/json" \
  -d '{"title":"Great Song","year":2024,"performer":"Artist","genre":"Rock","duration":180}'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`I have gathered comprehensive information about the project including:

- Project overview and features from the existing README
- Dependencies and scripts from package.json
- Server setup and plugin registration from src/server.js
- API routes for albums, songs, users, authentications, playlists, and collaborations
- Database schema and migrations for albums, songs, users, playlists, playlist_songs, authentications, collaborations, and playlist_activities