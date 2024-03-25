//maneja la logica relacionada con las vistas

import ViewsDao from '../dao/viewsDao.js';

// Lógica relacionada con las vistas
const getHomePage = (req, res) => {
  // Implementa la lógica para obtener la página de inicio
  res.render('home');
};

const getLoginView = (req, res) => {
  // Implementa la lógica para obtener la vista de inicio de sesión
  res.render('login');
};

export default {
  getHomePage,
  getLoginView,
};
