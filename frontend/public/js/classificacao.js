async function carregarClassificacao() {
  const tbody = document.querySelector("#tabelaClassificacao tbody");
  tbody.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

  const res = await fetch("/api/students/classificacao-geral");
  const data = await res.json();

  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.nome}</td>
      <td>${item.ra}</td>
      <td>${item.total_lidos}</td>
      <td>${item.classificacao}</td>
    </tr>
  `).join("");
}

document.getElementById("btnAtualizar").addEventListener("click", carregarClassificacao);
carregarClassificacao();
