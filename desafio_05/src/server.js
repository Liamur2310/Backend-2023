import express from "express";
import path from "path";
import handlebars from "express-handlebars";
import viewsRouter from './routes/views.routes.js';
import productsRouter from "./routes/products.routes.js";
import ProductsManager from "./managers/product_manager.js";
import __dirname from "./utils.js";
// importamos socket.io para trabajar con websockets
import {Server} from 'socket.io'

const app = express();
const PORT = 8081;
const httpServer = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// inicializamos socket.io pasandole el servidor http
const socketServer = new Server(httpServer);   

//midlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuramos el engine
app.engine(
  "hbs", handlebars.engine({
    // index.hbs
    extname: "hbs",
    // Plantilla principal
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
);
  
// Seteamos nuestro motor
app.set("views", `${__dirname}/views`);;
app.set("view engine", "hbs");

// Public
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/", viewsRouter);
app.use ("/api/products", productsRouter);


const productsManager = new ProductsManager(`${__dirname}/managers/productos.json`);

// conexión de un cliente a través de websockets ( aqui se realiza el handshake )
socketServer.on('connection', (socket) => {
  
  console.log('Nuevo cliente conectado');

  // escuchamos el evento 'createProduct' y recibimos el producto para agregarlo a la lista
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
  
    // emite la nueva lista de productos a todos los clientes ( desde el servidor al client )
    socket.emit('updateProductsList', product);
  });

})