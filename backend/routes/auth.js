const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin', user: username }, JWT_SECRET, {
      expiresIn: '4h',
    });
    return res.json({ token, user: username });
  }

  return res.status(401).json({ message: 'Invalid admin credentials' });
});

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = router;
module.exports.verifyAdmin = verifyAdmin;
