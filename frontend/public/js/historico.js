async function carregarHistorico() {
  const tbody = document.querySelector("#tabelaHistorico tbody");
  tbody.innerHTML = "<tr><td colspan='6'>Carregando...</td></tr>";

  try {
    const res = await fetch("/api/loans");
    const dados = await res.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      tbody.innerHTML = "<tr><td colspan='6'>Nenhum empréstimo encontrado.</td></tr>";
      return;
    }

    tbody.innerHTML = dados.map(l => `
      <tr>
        <td>${l.id}</td>
        <td>${l.nome}</td>
        <td>${l.ra}</td>
        <td>${l.titulo}</td>
        <td>${l.retirada ? new Date(l.retirada).toLocaleString('pt-BR') : '-'}</td>
        <td>${l.devolucao ? new Date(l.devolucao).toLocaleString('pt-BR') : '—'}</td>
      </tr>
    `).join("");

  } catch (err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='6'>Erro ao carregar histórico.</td></tr>";
  }
}

document.getElementById("btnAtualizar").addEventListener("click", carregarHistorico);
document.addEventListener("DOMContentLoaded", carregarHistorico);
