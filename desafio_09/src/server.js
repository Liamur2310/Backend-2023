import app from './app.js';
import { Server } from 'socket.io';
import ProductRepository from './repository/productRepository.js';
import path from 'path'; 

const PORT = 8081;

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
const productsRepository = ProductRepository;

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('createProduct', async (product) => { 
    try {
      await productsRepository.createProduct(product); 
      const products = await productsRepository.getAllProducts(); // Obtener todos los productos después de crear uno nuevo
      io.emit('updateProductsList', products); // Emitir la nueva lista de productos a todos los clientes
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  });
});
