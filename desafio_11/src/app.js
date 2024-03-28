import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import __dirname from './utils.js'; 
import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import authRouter from './routes/auth.router.js';
import path from 'path';
import dotenv from 'dotenv';
import winston from 'winston';
import errorHandler from './error/errorHandler.js';

dotenv.config();  

const app = express();

// Configuración del motor de plantillas
app.engine('hbs', handlebars.engine({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware para manejar sesiones con connect-mongo
const mongoUrl = process.env.MONGODB_URL;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // Conecta a MongoDB
    console.log("Conectado con éxito a MongoDB usando Mongoose.");
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Mongoose: " + error);
    process.exit(1); 
  }
};
connectMongoDB();

const mongoStore = MongoStore.create({
  mongoUrl: mongoUrl,
  dbName: 'desafio_11',
});

// Configuración de express-session
app.use(session({
  secret: 'hola', // Clave secreta para firmar la sesión
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Impide que JavaScript acceda a la cookie de sesión
    sameSite: 'strict', // Evita la vulnerabilidad de CSRF
  },
}));

// Configuración del logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ],
});


// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para cifrar contraseñas antes de guardarlas
app.use(async (req, res, next) => {
  if (req.body.password) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  const errorMessage = errorHandler(err.message);
  res.status(500).send(errorMessage);
});

// Middleware para registrar mensajes de log en puntos importantes
app.use((req, res, next) => {
  req.logger = logger;
  next();
});


// rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/auth', authRouter);


// rutas para probar los logs
app.get('/loggerTest', (req, res) => {
  req.logger.debug('Debug message');
  req.logger.http('HTTP message'); 
  req.logger.info('Info message');
  req.logger.warn('Warning message');
  req.logger.error('Error message');
  req.logger.log({ level: 'error', message: 'Fatal message' }); 

  res.send('Logger test complete!');
});

// Manejador de errores
app.use((err, req, res, next) => {
  req.logger.error(err.stack);
  res.status(500).send('Internal Server Error');
});

export default app;