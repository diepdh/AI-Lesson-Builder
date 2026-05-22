const express = require('express');
const router = express.Router();
const exportService = require('../services/export.service');

// Trigger export (runs scripts/export-webapp.ps1)
router.post('/export', async (req, res) => {
  try {
    const result = exportService.runExport();
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.error, details: result.details });
    }
    return res.json({ ok: true, zip: result.zip, out: result.out });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
