const express = require("express");
const router = express.Router();
const pool = require("../db");

// RETIRAR
router.post("/retirar", async (req, res) => {
  const { ra, book_id } = req.body;
  try {
    const [alunoRows] = await pool.query("SELECT id FROM students WHERE ra = ?", [ra]);
    if (alunoRows.length === 0) return res.status(404).json({ message: "Aluno não encontrado." });
    const student_id = alunoRows[0].id;

    const [emprestimoAtivo] = await pool.query(
      "SELECT id FROM loans WHERE student_id = ? AND book_id = ? AND devolucao IS NULL",
      [student_id, book_id]
    );
    if (emprestimoAtivo.length > 0)
      return res.status(400).json({ message: "Este aluno já retirou este livro e ainda não devolveu." });

    const [livroRows] = await pool.query("SELECT id FROM books WHERE id = ?", [book_id]);
    if (livroRows.length === 0) return res.status(404).json({ message: "Livro não encontrado." });

    await pool.query("INSERT INTO loans (student_id, book_id, retirada) VALUES (?, ?, NOW())", [student_id, book_id]);
    res.json({ message: "Livro retirado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar retirada." });
  }
});

// DEVOLVER
router.post("/devolver", async (req, res) => {
  const { ra, book_id } = req.body;
  try {
    const [alunoRows] = await pool.query("SELECT id FROM students WHERE ra = ?", [ra]);
    if (alunoRows.length === 0) return res.status(404).json({ message: "Aluno não encontrado." });
    const student_id = alunoRows[0].id;

    const [emprestimo] = await pool.query(
      "SELECT id FROM loans WHERE student_id = ? AND book_id = ? AND devolucao IS NULL",
      [student_id, book_id]
    );
    if (emprestimo.length === 0) return res.status(404).json({ message: "Nenhum empréstimo ativo encontrado." });

    await pool.query("UPDATE loans SET devolucao = NOW() WHERE id = ?", [emprestimo[0].id]);
    res.json({ message: "Livro devolvido com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registrar devolução." });
  }
});

// LISTAR HISTÓRICO COMPLETO
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        l.id,
        s.nome,
        s.ra,
        b.titulo,
        l.retirada,
        l.devolucao
      FROM loans l
      JOIN students s ON s.id = l.student_id
      JOIN books b ON b.id = l.book_id
      ORDER BY l.retirada DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao listar histórico." });
  }
});

module.exports = router;
