const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

class StorageService {
  constructor() {
    this._folder = path.resolve(__dirname, '../../../uploads/images');
  }

  async writeFile(file, meta) {
    const filename = `${nanoid(16)}-${meta.filename}`;
    const filepath = path.join(this._folder, filename);

    if (!fs.existsSync(this._folder)) {
      fs.mkdirSync(this._folder, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filepath);

    return new Promise((resolve, reject) => {
      writeStream.on('error', reject);
      writeStream.on('finish', () => resolve(filename));
      file.pipe(writeStream);
    });
  }

  async deleteFile(filename) {
    const filepath = path.join(this._folder, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}

module.exports = StorageService;
