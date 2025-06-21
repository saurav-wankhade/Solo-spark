const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const auth = require('../middleware/auth');

const upload = multer({ storage });

const router = express.Router();

// Upload photo/audio — returns Cloudinary URL
router.post('/file', auth, upload.single('file'), async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'Upload failed' });
  }

  res.json({ url: req.file.path });
});

module.exports = router;
