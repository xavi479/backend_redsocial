const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/db_socialnet", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Conectado correctamente a la BD: db_socialnet");
  } catch (error) {
    console.error("No se ha podido conectar a la base de datos:", error);
    throw new Error("No se ha podido conectar a la base de datos!");
  }
}

module.exports = connection;
