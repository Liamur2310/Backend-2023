import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.routes.js';
import productsRouter from "./routes/products.routes.js";
import ProductsManager from "./managers/product_manager.js";
import session from 'express-session';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import { Server } from 'socket.io';
import authRouter from './routes/auth.router.js';
import __dirname from "./utils.js";
import bcrypt from 'bcrypt';


const app = express();
const PORT = 8081;

//para generar el hash 
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10));  //el 10 es parte del encriptamiento , de saltos 
export const isValidPassword = (user, password)=> bcrypt.compareSync(password, user.password);


// Configuración del motor de plantillas
app.engine("hbs", handlebars.engine({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set("views", `${__dirname}/views`);;
app.set("view engine", "hbs");

// Middleware para manejar sesiones con connect-mongo
const mongoStore = MongoStore.create({
  dbName: 'desafio_07',
  mongoUrl: 'mongodb+srv://liamur:*****@liamur.ew426gj.mongodb.net/?retryWrites=true&w=majority',
 // ttl: 10 * 60,
});

// Configuración de express-session
app.use(session({
  secret: 'hola',
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Tiempo de vida de la cookie e
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, // Evita que JavaScript acceda a la cookie en el navegador
    sameSite: 'strict', // Mejora la seguridad al limitar el envío de cookies a solicitudes del mismo sitio
  },
}));

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para archivos estáticos
app.use(express.static(`${__dirname}/public`));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/auth', authRouter);
app.set("views", path.join(__dirname, "views"));


// Inicialización del manager de productos
const productsManager = new ProductsManager(`${__dirname}/managers/productos.json`);

// Conexión a MongoDB
mongoose.connect('mongodb+srv://liamur:******@liamur.ew426gj.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true , dbName: 'desafio_07'})
.then(() => {
    console.log('Conectado a MongoDB');

    // Inicio del servidor
    const httpServer = app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

    // Inicialización de socket.io
    const socketServer = new Server(httpServer);

    // Conexión de clientes a través de websockets
    socketServer.on('connection', (socket) => {
      console.log('Nuevo cliente conectado');

      // Escucha el evento 'createProduct' y recibe el producto para agregarlo a la lista
      socket.on('createProduct', (product) => {
        productsManager.addProduct(
          product.title,
          product.description,
          product.code,
          product.price,
          product.state,
          product.stock,
          product.category,
          product.thumbnails
        );

        // Emite la nueva lista de productos a todos los clientes
        socket.emit('updateProductsList', product);
      });
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });

export default app;