const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PORTABLE_MEDIA_DIR = path.join(__dirname, '../data/media');

/**
 * Proxy to serve local files through HTTP to bypass browser local file restrictions.
 * GET /api/media?path=C:/absolute/path/to/file.jpg
 */
router.get('/', (req, res) => {
  let filePath = req.query.path;

  if (req.query.file) {
    const requested = String(req.query.file);
    const resolved = path.resolve(PORTABLE_MEDIA_DIR, requested);
    const mediaRoot = path.resolve(PORTABLE_MEDIA_DIR);

    if (!resolved.startsWith(mediaRoot + path.sep) && resolved !== mediaRoot) {
      return res.status(400).json({ ok: false, error: 'Invalid media file path' });
    }

    filePath = resolved;
  }

  if (!filePath) {
    return res.status(400).json({ ok: false, error: 'Missing path parameter' });
  }

  // Basic security: check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'File not found' });
  }

  // Check if it is a file
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    return res.status(400).json({ ok: false, error: 'Path is not a file' });
  }

  // Stream the file
  res.sendFile(path.resolve(filePath));
});

module.exports = router;
