import express from 'express';
import productRepository from '../services/repository/product.repository.js';
import authorizationMiddleware from '../authorizacion/authorizationMiddleware.js';
import generateMockProducts from '../mocking/mocking.js'; 

// Crea un router para gestionar las rutas relacionadas con los productos
const router = express.Router();

// Middleware para imprimir información de la solicitud
router.use((req, res, next) => {
    console.log("Request:", req.method, req.originalUrl);
    next();
});

// defino un customizador de errores y un diccionario de errores
const errorDictionary = {
    'invalid_parameters': 'Parámetros inválidos',
    'internal_server_error': 'Error interno del servidor'
};

const errorHandler = (res, errorCode) => {
    const errorMessage = errorDictionary[errorCode] || 'Error desconocido';
    res.status(500).json({ status: 'error', error: errorMessage });
};

// Ruta para obtener productos paginados
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;

        // Obtener todos los productos
        let products = await productRepository.getAllProducts();

        // Filtrar los productos según el query
        if (query) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Ordenar los productos según el sort
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                default:
                    // No hacer nada si el sort no es válido
                    break;
            }
        }

        // Calcular el índice del primer producto en la página
        const startIndex = (page - 1) * limit;
        // Obtener los productos para la página actual
        const paginatedProducts = products.slice(startIndex, startIndex + limit);

        // Enviar la respuesta con los productos paginados
        res.status(200).json({ status: 'success', data: paginatedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', authorizationMiddleware.isAdmin, async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ status: 'error', error: 'Parámetros inválidos' });
        }

        const newProduct = await productRepository.createProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', authorizationMiddleware.isAdmin, async (req, res) => {
    try {
        const productId = req.params.pid;
        await productRepository.deleteProduct(productId);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', authorizationMiddleware.isAdmin, async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedData = req.body;
        const updatedProduct = await productRepository.updateProduct(productId, updatedData);
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockProducts();
    res.json(mockProducts);
});

export default router;
