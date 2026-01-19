// cadastro
document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const ra = document.getElementById('ra').value.trim();
  const email = document.getElementById('email').value.trim();

  const msgDiv = document.getElementById('studentMessage');
  msgDiv.style.display = 'none';
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, ra, email })
    });
    const data = await res.json();
    msgDiv.style.display = 'block';
    msgDiv.textContent = data.message || 'Aluno cadastrado com sucesso';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 4000);
    document.getElementById('studentForm').reset();
  } catch (err) {
    msgDiv.style.display = 'block';
    msgDiv.textContent = 'Erro ao cadastrar aluno';
    console.error(err);
  }
});

// carregar livros disponiveis
async function carregarLivrosDisponiveis() {
  const tbody = document.querySelector('#livrosTable tbody');
  tbody.innerHTML = '<tr><td colspan="3">Carregando...</td></tr>';
  try {
    const res = await fetch('/api/books/disponiveis');
    const livros = await res.json();
    if (!Array.isArray(livros) || livros.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3">Nenhum livro disponível</td></tr>';
      return;
    }
    tbody.innerHTML = livros.map(l => `
      <tr>
        <td>${l.id}</td>
        <td>${l.titulo}</td>
        <td>${l.autor || '-'}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error(err);
    tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar livros</td></tr>';
  }
}
document.getElementById('btnLivros').addEventListener('click', carregarLivrosDisponiveis);
document.addEventListener('DOMContentLoaded', carregarLivrosDisponiveis);
