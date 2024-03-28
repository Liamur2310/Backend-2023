// carts.routes.js
import express from 'express';
import ProductsManager from '../managers/product_manager.js'; 
import CartsManager from '../managers/carts_manager.js';
import PurchaseController from '../controllers/purchaseController.js'; // Asume que este controlador maneja la creación de tickets.

const router = express.Router();

// Instanciación del manejador de productos y carritos
const productManager = new ProductsManager("./data/products.json");
const cartsManager = new CartsManager("./data/carts.json", productManager);

// Ruta para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const cart = await cartsManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito" });
    }
});

// Ruta para agregar productos al carrito
router.post('/:cid/products', async (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;

    try {
        await cartsManager.addProductToCart(cid, productId, quantity);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error al agregar producto al carrito" });
    }
});

// Ruta para eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await cartsManager.removeProductFromCart(cid, pid);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto del carrito" });
    }
});

// Ruta para finalizar la compra del carrito y generar un ticket
router.post('/:cid/purchase', async (req, res) => {
    const { cid } = req.params; // ID del carrito
    const purchaserEmail = req.body.email; // Email del comprador

    try {
       //finalizePurchase hace todo el proceso necesario incluyendo verificar stock, actualizar stock, generar y guardar el ticket, etc.
        const result = await PurchaseController.createTicket(cid, purchaserEmail);

        // Devolver resumen de la compra o ticket generado
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        res.status(500).json({ message: "Error al finalizar la compra" });
    }
});

export default router;
