const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os livros
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books ORDER BY id DESC");
    const livros = await Promise.all(rows.map(async (b) => {
      const [[count]] = await pool.query(
        "SELECT COUNT(*) AS cnt FROM loans WHERE book_id = ? AND devolucao IS NULL",
        [b.id]
      );
      return { ...b, disponivel: count.cnt === 0 ? 1 : 0 };
    }));
    res.json(livros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar livros" });
  }
});

// Cadastrar livro
router.post('/', async (req, res) => {
  const { titulo, autor, isbn, quantidade } = req.body;
  if (!titulo) return res.status(400).json({ message: "Título é obrigatório" });

  try {
    const [result] = await pool.query(
      "INSERT INTO books (titulo, autor, isbn, quantidade) VALUES (?, ?, ?, ?)",
      [titulo, autor || null, isbn || null, Number(quantidade) || 1]
    );
    res.json({ id: result.insertId, message: "Livro cadastrado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao cadastrar livro" });
  }
});

// Listar livros disponíveis 
router.get('/disponiveis', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*
      FROM books b
      LEFT JOIN loans l ON l.book_id = b.id AND l.devolucao IS NULL
      WHERE l.id IS NULL
      ORDER BY b.titulo
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar livros disponíveis" });
  }
});

module.exports = router;
