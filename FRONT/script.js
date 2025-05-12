document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formularioLibro");
  const cancelarBtn = document.getElementById("cancelarEdicion"); // Asegurate de que exista
  const listaLibros = document.getElementById("listaLibros");
  const buscador = document.getElementById("buscador");

  let libros = [];
  let editandoId = null;
  const API_URL = "http://localhost:5050/libros";

  cargarLibros();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const contenido = document.getElementById("contenido").value.trim();

    const datos = { titulo, autor, contenido };

    if (editandoId) {
      await fetch(`${API_URL}/${editandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
    }

    form.reset();
    editandoId = null;
    if (cancelarBtn) cancelarBtn.style.display = "none";
    await cargarLibros();
  });

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", () => {
      form.reset();
      editandoId = null;
      cancelarBtn.style.display = "none";
    });
  }

  buscador.addEventListener("input", () => {
    const filtro = buscador.value.toLowerCase();
    const filtrados = libros.filter(libro => libro.titulo.toLowerCase().includes(filtro));
    renderLibros(filtrados);
  });

  async function cargarLibros() {
    const res = await fetch(API_URL);
    libros = await res.json();
    renderLibros(libros);
  }

  function renderLibros(librosParaMostrar) {
    listaLibros.innerHTML = "";
    librosParaMostrar.forEach(libro => {
      const div = document.createElement("div");
      div.className = "libro";
      div.innerHTML = `
        <h3>${libro.titulo}</h3>
        <p><strong>Autor:</strong> ${libro.autor}</p>
        <p>${libro.contenido}</p>
        <div class="acciones">
          <button onclick="editarLibro('${libro._id}')">Editar</button>
          <button onclick="eliminarLibro('${libro._id}')">Eliminar</button>
        </div>
      `;
      listaLibros.appendChild(div);
    });
  }

  window.editarLibro = (id) => {
    const libro = libros.find(l => l._id === id);
    document.getElementById("titulo").value = libro.titulo;
    document.getElementById("autor").value = libro.autor;
    document.getElementById("contenido").value = libro.contenido;
    editandoId = id;
    if (cancelarBtn) cancelarBtn.style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.eliminarLibro = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await cargarLibros();
  };
});
