// Importar las dependencias 
import express from 'express';
import ProductsManager from '../managers/product_manager.js';

// Crear un router para gestionar las rutas relacionadas con los productos
const router = express.Router();
const manager = new ProductsManager("../src/managers/productos.json");

// Middleware para imprimir información de la solicitud
router.use((req, res, next) => {
    console.log("Request:", req.method, req.originalUrl);
    next();
});

// Ruta para obtener productos paginados
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;

        let products = manager.getProducts();

        const queryLower = query ? query.toLowerCase() : '';

        switch (queryLower) {
            case 'category':
                const category = req.query.category;
                if (category) {
                    products = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
                }
                break;

            case 'availability':
                const availability = req.query.availability;
                if (availability) {
                    products = products.filter(product => product.availability.toLowerCase() === availability.toLowerCase());
                }
                break;
        }

        if (sort) {
            if (sort === 'asc') {
                products.sort((a, b) => a.price - b.price);
            } else if (sort === 'desc') {
                products.sort((a, b) => b.price - a.price);
            }
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);

        const username = req.session.user ? req.session.user.name : null;
        const role = req.session.user ? req.session.user.role : null;

        const totalPages = Math.ceil(products.length / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = endIndex < products.length;
        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null;

        const responseObj = {
            status: 'success',
            payload: paginatedProducts,
            totalPages,
            prevPage: page - 1,
            nextPage: page + 1,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        };

        // Renderizar la vista realTimeProducts y pasar datos del usuario y productos paginados
        res.render('realTimeProducts', { username, products: responseObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        // Validar datos de entrada
        if (!title || !description || !code || !price || !status || !stock || !category) {
            return res.status(400).json({ status: 'error', error: 'Parámetros inválidos' });
        }

        // Llamar al método para agregar el producto
        const result = await manager.addProduct(title, description, code, price, status, stock, category, thumbnails);
        res.status(result.status).json(result.responseBody);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        // Llamar al método para eliminar el producto
        const result = await manager.deleteProduct(productId);
        res.status(result.status).json(result.responseBody);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const productID = parseInt(req.params.pid);
        const productFields = req.body;

        // Llamar al método para actualizar el producto
        const result = await manager.updateProduct(productID, productFields);
        res.status(result.status).json(result.responseBody);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

// Exportar el router para ser utilizado en otros archivos
export default router;
