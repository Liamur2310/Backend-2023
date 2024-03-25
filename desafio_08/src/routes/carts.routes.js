//define las rutas relacionadas con los carritos

import { response, Router } from "express";
import ProductsManager from "../managers/product_manager.js";
import CartsManager from "../managers/carts_manager.js";

const router = Router();

const productManager = new ProductsManager("./src/managers/productos.json");
const cartsManager = new CartsManager("./src/managers/carts.json", productManager);  

// generar nuevo carrito
router.post('/', async (req, res) => {
    let result = await cartsManager.generateCart();
    res.status(result.status).json(result.responseBody)
})


// agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    let cid = parseInt(req.params.cid);
    let pid = parseInt(req.params.pid);
    let quantity = parseInt(req.body.quantity);
    let result = await cartsManager.addProduct(cid, pid, quantity);
    res.status(result.status).json(result.responseBody)
})

// obtener carrito
router.get('/:cid', async (request, response) => {
    let id = parseInt(request.params.cid);
    let result = await cartsManager.getCartById(id);
    response.status(result.status).json(result.responseBody);
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (request, response) => {
    let cid = parseInt(request.params.cid);
    let pid = parseInt(request.params.pid);
    let result = await cartsManager.removeProduct(cid, pid);
    response.status(result.status).json(result.responseBody);
});

// Actualizar carrito con un arreglo de productos
router.put('/:cid', async (request, response) => {
    let cid = parseInt(request.params.cid);
    let products = request.body.products;
    let result = await cartsManager.updateCart(cid, products);
    response.status(result.status).json(result.responseBody);
});

// Actualizar cantidad de ejemplares de un producto en el carrito
router.put('/:cid/products/:pid', async (request, response) => {
    let cid = parseInt(request.params.cid);
    let pid = parseInt(request.params.pid);
    let quantity = parseInt(request.body.quantity);
    let result = await cartsManager.updateProductQuantity(cid, pid, quantity);
    response.status(result.status).json(result.responseBody);
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (request, response) => {
    let cid = parseInt(request.params.cid);
    let result = await cartsManager.clearCart(cid);
    response.status(result.status).json(result.responseBody);
});

export default router;