const apiBase = '/api';

document.addEventListener('DOMContentLoaded', () => {
  const bookForm = document.getElementById('bookForm');
  const bookMessage = document.getElementById('bookMessage');
  const booksAdminTable = document.querySelector('#booksAdminTable tbody');
  const refreshBtn = document.getElementById('refreshBooksAdmin');

  bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    bookMessage.innerHTML = '';

    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const isbn = document.getElementById('isbn').value.trim();
    const quantidade = Number(document.getElementById('quantidade').value || 1);

    try {
      const res = await fetch(`${apiBase}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor, isbn, quantidade })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar livro');

      bookMessage.innerHTML = `<div class="message success">Livro cadastrado! ID: ${data.id}</div>`;
      bookForm.reset();
      loadAllBooks();
    } catch (err) {
      bookMessage.innerHTML = `<div class="message error">${err.message}</div>`;
    }
  });

  refreshBtn.addEventListener('click', loadAllBooks);

  async function loadAllBooks() {
    booksAdminTable.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';

    try {
      const res = await fetch(`${apiBase}/books`);
      const books = await res.json();

      if (!res.ok) throw new Error('Erro ao carregar livros');

      if (books.length === 0) {
        booksAdminTable.innerHTML = '<tr><td colspan="5">Nenhum livro cadastrado</td></tr>';
        return;
      }

      booksAdminTable.innerHTML = books.map(book => `
        <tr>
          <td>${book.id}</td>
          <td>${book.titulo}</td>
          <td>${book.autor || '-'}</td>
          <td>${book.isbn || '-'}</td>
          <td>${book.quantidade}</td>
        </tr>
      `).join('');

    } catch (err) {
      booksAdminTable.innerHTML = '<tr><td colspan="5">Erro ao exibir livros</td></tr>';
    }
  }

  loadAllBooks();
});

//Indicadores simples
async function carregarIndicadores() {
  try {
    const res = await fetch(`${apiBase}/books/indicadores`);
    const dados = await res.json();
    if (!res.ok) throw new Error();

    const indicadoresDiv = document.createElement('div');
    indicadoresDiv.className = 'indicadores';
    indicadoresDiv.innerHTML = `
      <p><strong>Alunos:</strong> ${dados.alunos}</p>
      <p><strong>Livros:</strong> ${dados.livros}</p>
      <p><strong>Empréstimos ativos:</strong> ${dados.emprestimos}</p>
    `;

    document.querySelector('.container').prepend(indicadoresDiv);
  } catch {
    console.log('Erro ao carregar indicadores');
  }
}

carregarIndicadores();

