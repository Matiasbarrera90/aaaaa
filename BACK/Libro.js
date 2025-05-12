const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  contenido: String,
}, { timestamps: true });

module.exports = mongoose.model("Libro", libroSchema);
