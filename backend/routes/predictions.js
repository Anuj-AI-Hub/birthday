const express = require('express');
const fs = require('fs');
const path = require('path');
const { predict } = require('../model');
const router = express.Router();

const submissionsFile = path.join(__dirname, '../data/submissions.json');

function loadSubmissions() {
  try {
    return JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
  } catch (error) {
    return [];
  }
}

function saveSubmissions(submissions) {
  fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
}

router.post('/predict', (req, res) => {
  const { subject = '', body = '' } = req.body;

  if (!subject.trim() && !body.trim()) {
    return res.status(400).json({ message: 'Provide subject or body text' });
  }

  const result = predict({ subject, body });
  const record = {
    id: Date.now(),
    subject,
    body,
    prediction: result.prediction,
    confidence: result.confidence,
    createdAt: new Date().toISOString(),
  };

  const submissions = loadSubmissions();
  submissions.unshift(record);
  saveSubmissions(submissions.slice(0, 1000));

  res.json(result);
});

module.exports = router;
