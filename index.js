// Importaciones
const connection = require('./database/connection');
const express = require("express");
const cors = require("cors");

// Mensaje de bienvenida
console.log("API NODE arriba");

// Conexión a la BD
connection();

// Crear servidor de Node
const app = express();
const puerto = 3900;

// Configurar cors: permite que las peticiones se hagan correctamente
app.use(cors());

// Conversión de datos (body a objetos JS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.get('/test-router', (req, res) => {
  return res.status(200).json(
    {
      'id': 1,
      'name': 'Oscar',
      'username': 'LopezGomez'
    }
  );
});

// Configurar el servidor para escuchar las peticiones HTTP
app.listen(puerto, () => {
  console.log("Servidor de NODE corriendo en el puerto", puerto);
});
