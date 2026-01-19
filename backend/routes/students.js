const express = require('express');
const router = express.Router();
const pool = require('../db');

// Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao exibir alunos" });
  }
});

// Cadastrar aluno
router.post('/', async (req, res) => {
  const { nome, ra, email } = req.body;
  if (!nome || !ra) return res.status(400).json({ message: "Nome e RA são obrigatórios" });

  try {
    const [result] = await pool.query(
      "INSERT INTO students (nome, ra, email) VALUES (?, ?, ?)",
      [nome, ra, email || null]
    );
    res.json({ id: result.insertId, message: "Aluno cadastrado com sucesso" });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: "RA ou email já cadastrado" });
    } else {
      res.status(500).json({ message: "Erro ao cadastrar aluno" });
    }
  }
});

// Pontuação individual
router.get('/pontuacao/:ra', async (req, res) => {
  const { ra } = req.params;
  try {
    const [alunoRows] = await pool.query("SELECT id, nome FROM students WHERE ra = ?", [ra]);
    if (alunoRows.length === 0) return res.status(404).json({ message: "Aluno não encontrado" });
    const aluno = alunoRows[0];

    const [rows] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM loans
      WHERE student_id = ?
      AND devolucao IS NOT NULL
      AND retirada >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    `, [aluno.id]);

    const total = rows[0].total;
    let classificacao = "";
    if (total <= 5) classificacao = "Iniciante";
    else if (total <= 10) classificacao = "Regular";
    else if (total <= 20) classificacao = "Ativo";
    else classificacao = "Extremo";

    res.json({ nome: aluno.nome, total_lidos: total, classificacao });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao calcular pontuação" });
  }
});

// Classificação geral
router.get('/classificacao-geral', async (req, res) => {
  try {
    const [alunos] = await pool.query("SELECT id, nome, ra FROM students");
    const resultado = [];

    for (const aluno of alunos) {
      const [rows] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM loans
        WHERE student_id = ? AND devolucao IS NOT NULL
        AND retirada >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      `, [aluno.id]);
      const total = rows[0].total;
      let classificacao = "";
      if (total <= 5) classificacao = "Iniciante";
      else if (total <= 10) classificacao = "Regular";
      else if (total <= 20) classificacao = "Ativo";
      else classificacao = "Extremo";

      resultado.push({ nome: aluno.nome, ra: aluno.ra, total_lidos: total, classificacao });
    }

    resultado.sort((a,b) => b.total_lidos - a.total_lidos);
    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao gerar classificação geral" });
  }
});

module.exports = router;
