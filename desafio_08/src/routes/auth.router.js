//define las rutas relacionadas con la autenticacion

import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; 


const router = express.Router();

// Ruta para el formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para procesar el formulario de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Credenciales incorrectas. Inténtalo de nuevo.' });
    }

    req.session.user = { 
      email: user.email,
      username: user.username,
      role: user.email === 'adminCoder@coder.com' ? 'admin' : 'usuario',
      name: user.name
    };

    req.session.valid = true;

    res.redirect('/realtimeproducts'); 
    // Redirige a la vista de productos
  } catch (error) {
    console.error('Error durante el login:', error);
    res.render('login', { error: 'Error durante el login. Por favor, inténtalo de nuevo.' });
  }
});

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  //agregar manejo de error
  res.render('register');
});

// Ruta para procesar el formulario de registro
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('register', { error: 'Este correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let userRole = 'usuario'
    if (email == 'adminCoder@coder.com') {
      userRole = 'admin'
    }

 await User.create({
      email,
      username,
      password: hashedPassword,
      role: userRole,
    });
   

    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.render('register', { error: 'Error durante el registro. Por favor, inténtalo de nuevo.' });
  }
});

// Ruta para logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/');
    }
    res.redirect('/auth/login'); // Redirige al usuario a la página de login después de cerrar sesión
  });
});

export default router;