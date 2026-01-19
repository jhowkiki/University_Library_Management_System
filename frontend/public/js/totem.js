//RETIRAR
document.getElementById("retiradaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ra = document.getElementById("raRetirada").value;
  const book_id = document.getElementById("bookIdRetirada").value;

  const res = await fetch("/api/loans/retirar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ra, book_id })
  });

  const data = await res.json();
  document.getElementById("retiradaMessage").innerText = data.message;
});

//DEVOLVER
document.getElementById("devolucaoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ra = document.getElementById("raDevolucao").value;
  const book_id = document.getElementById("bookIdDevolucao").value;

  const res = await fetch("/api/loans/devolver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ra, book_id })
  });

  const data = await res.json();
  document.getElementById("devolucaoMessage").innerText = data.message;
});
