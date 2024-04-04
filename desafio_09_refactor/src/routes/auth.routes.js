// auth.routes.js
import express from 'express';
import bcrypt from 'bcrypt';
import userDao from '../dao/userDao.js';

const router = express.Router();

// Ruta para el formulario de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para procesar el formulario de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userDao.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Credenciales incorrectas. Inténtalo de nuevo.' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.email === 'adminCoder@coder.com' ? 'admin' : 'usuario',
      name: user.name
    };

    req.session.valid = true;

    res.redirect('/realtimeproducts');
  } catch (error) {
    console.error('Error durante el login:', error);
    res.render('login', { error: 'Error durante el login. Por favor, inténtalo de nuevo.' });
  }
});

// Ruta para el formulario de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para procesar el formulario de registro
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await userDao.getUserByEmail(email);

    if (existingUser) {
      return res.render('register', { error: 'Este correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let userRole = 'usuario';
    if (email === 'adminCoder@coder.com') {
      userRole = 'admin';
    }

    await userDao.createUser({
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
    res.redirect('/auth/login');
  });
});

// Ruta para obtener la información del usuario actual
router.get('/current', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userId = req.session.user.id;

    const userDTO = await userDao.getUserById(userId);

    res.json(userDTO);
  } catch (error) {
    console.error('Error al obtener la información del usuario actual:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
