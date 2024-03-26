//maneja la logica relacionada con la autenticacion

// authController.js
import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';

// Manejo de autenticación y creación de usuarios
const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

// Ruta para iniciar sesión con GitHub
const githubLogin = passport.authenticate('github');

// Callback de GitHub
const githubCallback = passport.authenticate('github', { failureRedirect: '/' });

// Logout
const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

// Implementa la lógica de registro de usuario
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = createHash(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

// Implementa la lógica de inicio de sesión
const loginUser = passport.authenticate('local', {
  successRedirect: '/', // Redirige a la página principal si la autenticación es exitosa
  failureRedirect: '/login', // Redirige a la página de inicio de sesión si falla la autenticación
  failureFlash: true, // Activa mensajes flash en caso de fallo de autenticación
});

export default {
  createHash,
  isValidPassword,
  githubLogin,
  githubCallback,
  logout,
  registerUser,
  loginUser,
};
