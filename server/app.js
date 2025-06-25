const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const templateRoutes = require('./routes/templateRoutes');
const adminRoutes = require('./routes/adminRoutes');
const policyRoutes = require('./routes/policyRoutes');
const commonBlankRoutes = require('./routes/commonBlankRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/commonBlank', commonBlankRoutes);
// app.use('/api/answers', answerRoutes);

app.get('/', (req, res) => res.send('API Running'));

module.exports = app;