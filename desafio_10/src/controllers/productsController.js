//maneja la logica relacionada a productos
import ProductManager from '../managers/product_manager.js';

class ProductController {
    constructor() {
        this.productManager = new ProductManager('path/to/products.json');
    }

    async addProduct(req, res) {
        try {
            const { title, description, price } = req.body;


            const result = await this.productManager.addProduct(title, description,price);

            res.status(result.status).json(result.responseBody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getProducts(req, res) {
        try {
            const products = await this.productManager.getProducts();
            res.status(200).json({ products });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await this.productManager.getProductById(productId);

            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const updateProduct = req.body;

            const result = await this.productManager.updateProduct(productId, updateProduct);

            res.status(result.status).json(result.responseBody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const result = await this.productManager.deleteProduct(productId);

            res.status(result.status).json(result.responseBody);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    
}

export default new ProductController();
