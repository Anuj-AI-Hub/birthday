const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyAdmin } = require('./auth');
const router = express.Router();

const submissionsFile = path.join(__dirname, '../data/submissions.json');

function loadSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
  } catch (error) {
    return [];
  }
}

router.get('/submissions', verifyAdmin, (req, res) => {
  res.json(loadSubmissions());
});

module.exports = router;
