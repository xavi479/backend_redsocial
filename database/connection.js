const mongoose = require("mongoose");

const connection = async() => {

  try {
    await mongoose.connect ("mongodb://localhost:27017/db_socialnet");
    console.log("Conectado correctamente a la BD: db_socialnert");
  } catch (error) {
    console.log(error);
    throw new error("¡No seha podido conectar a la base de datos");
  }
}

module.exports = connection;