
const multer = require('multer');

export const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

export default upload