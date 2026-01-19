// ================================
// CADASTRAR LIVRO
// ================================
document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;

  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, autor })
  });

  const data = await res.json();

  document.getElementById("bookMessage").innerText =
    data.message || "Livro cadastrado com sucesso!";

  document.getElementById("bookForm").reset();
  carregarLivros();
});

// ================================
// LISTAR LIVROS
// ================================
async function carregarLivros() {
  const tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

  const res = await fetch("/api/books");
  const livros = await res.json();

  tbody.innerHTML = livros
    .map(
      (l) => `
    <tr>
      <td>${l.id}</td>
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td>${l.disponivel === 1 ? "Disponível" : "Emprestado"}</td>
    </tr>
  `
    )
    .join("");
}

document
  .getElementById("refreshBooks")
  .addEventListener("click", carregarLivros);

carregarLivros();
