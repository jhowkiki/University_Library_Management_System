const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const studentsRoutes = require('./routes/students');
const booksRoutes = require('./routes/books');
const loansRoutes = require('./routes/loans');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas API
app.use('/api/students', studentsRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/loans', loansRoutes);
const publicPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
