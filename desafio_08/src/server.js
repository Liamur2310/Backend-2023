// server.js
import app from './app.js';
import { Server } from 'socket.io';
import ProductsManager from './managers/product_manager.js';
import __dirname from './utils.js';

const PORT = 8081;

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
const productsManager = new ProductsManager(`${__dirname}/managers/productos.json`);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

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
    io.emit('updateProductsList', productsManager.getProducts());
  });
});
