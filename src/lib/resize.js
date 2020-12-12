import sharp, { fit as _fit } from 'sharp'
import '@babel/polyfill'
//import uuidv4 from 'uuid/v4'
const { v4: uuidv4 } = require('uuid');
import { resolve } from 'path'

export class Resize {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = Resize.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: _fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  static filename() {
    return `${uuidv4()}.png`;
  }
  filepath(filename) {
    return resolve(`${this.folder}/${filename}`)
  }
}
export default Resize