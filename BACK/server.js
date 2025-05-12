require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Libro = require("./Libro"); 
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Conectado a MongoDB`);
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Error al conectar con MongoDB:", err);
    process.exit(1);
  });

// GET todos los libros
app.get("/libros", async (req, res) => {
  const libros = await Libro.find().sort({ createdAt: -1 });
  res.json(libros);
});

// POST agregar libro
app.post("/libros", async (req, res) => {
  const { titulo, autor, contenido } = req.body;
  const nuevo = new Libro({ titulo, autor, contenido });
  await nuevo.save();
  res.status(201).json(nuevo);
});

// PATCH actualizar libro
app.patch("/libros/:id", async (req, res) => {
  const { id } = req.params;
  const actualizado = await Libro.findByIdAndUpdate(id, req.body, { new: true });
  res.json(actualizado);
});

// DELETE eliminar libro
app.delete("/libros/:id", async (req, res) => {
  const { id } = req.params;
  await Libro.findByIdAndDelete(id);
  res.status(204).end();
});
