import status from "express/lib/response.js";
import User from "../models/user.js"
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js";


// Acciones de prueba
export const testUser = (req, res) => {
  return res.status(200).send({
    message: "Mensaje enviado desde el controlador: user.js"
  });
}

// Registro de usuarios
export const register = async (req, res) => {
  try {
    // Recoger datos de la petición
    let params = req.body;

    // Validaciones: verificamos que los datos obligatorios estén presentes
    if (!params.name || !params.last_name || !params.email || !params.password || !params.nick){
      return res.status(400).json({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }

    // Crear una instancia del modelo User con los datos validados
    let user_to_save = new User(params);

    // Buscar si ya existe un usuario con el mismo email o nick
    const existingUser = await User.findOne({
      $or: [
        { email: user_to_save.email.toLowerCase() },
        { nick: user_to_save.nick.toLowerCase() }
      ]
    });

    // Si encuentra un usuario, devuelve un mensaje indicando que ya existe
    if(existingUser) {
      return res.status(409).json({
        status: "error",
        message: "!El usuario ya existe!"
      });
    }

    // Cifrar contraseña
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(user_to_save.password, salt);
    user_to_save.password = hasedPassword;

    // Guardar el usuario en la base de datos
    await user_to_save.save();

    // Devolver respuesta exitosa y el usuario registrado
    return res.status(201).json({
      status: "created",
      message: "Usuario registrado con éxito",
      user: user_to_save
    });

  } catch (error) {
    console.log("Error en registro de usuario:", error);
    return res.status(500).json({
      status: "error",
      message: "Error en registro de usuarios"
    });
  }
}

// Método para autenticar usuarios
export const login = async (req, res) => {
  try {

    // Recoger los parámetros del body
    let params = req.body;

    // Validar si llegaron el email y password
    if (!params.email || !params.password){
      return res.status(400).send({
        status: "error",
        message: "Faltan datos por enviar"
      });
    }

    // Buscar en la BD si existe el email que nos envió el usuario
    const user = await User.findOne({ email: params.email.toLowerCase()});

    // Si no existe el user
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado"
      });
    }

    // Comprobar si el password recibido es igual al que está almacenado en la BD
    const validPassword = await bcrypt.compare(params.password, user.password);

    // Si los passwords no coinciden
    if (!validPassword) {
      return res.status(401).json({
        status: "error",
        message: "Contraseña incorrecta"
      });
    }

//Generamos el token de autenticación

const token = createToken(user);

//Devolver el token y los dartos de los usuarios
return res.status(200).json({
  status: "success",
  message: "Login exitoso",
  token,
  user: {
    id: user._id,
    name: user.name,
    last_name: user.last_name,
    nick :user.nick,
    role: user.role,
    imagen: user.imagen,
    created_at: user.created_at
  }
});

  } catch (error) {
    console.log("Error en el login del usuario: ", error);
    return res.status(500).json({
      status: "error",
      message: "Error en el login del usuario"
    });
  }
}
