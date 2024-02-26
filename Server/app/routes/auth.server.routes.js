// auth srever routes
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.server.controller');

// POST route for student login
router.post('/login', studentController.authenticate);

module.exports = router;
