import { response, Router } from "express";
import ProductsManager from "../managers/product_manager.js";
import CartsManager from "../managers/carts_manager.js";

const router = Router();

const productManager = new ProductsManager("./src/managers/productos.json");
const cartsManager = new CartsManager("./src/managers/carts.json", productManager);  

// generar nuevo carrito
router.post('/', async (request, response) => {
    let result = await cartsManager.generateCart();
    response.status(result.status).json(result.responseBody)
})


// agregar producto al carrito
router.post('/:cid/products/:pid', async (request, response) => {
    let cid = parseInt(request.params.cid);
    let pid = parseInt(request.params.pid);
    let quantity = parseInt(request.body.quantity);
    let result = await cartsManager.addProduct(cid, pid, quantity);
    response.status(result.status).json(result.responseBody)
})

// obtener carrito
router.get('/:cid', async (request, response) => {
    let id = parseInt(request.params.cid);
    let result = await cartsManager.geCartById(id);
    response.status(result.status).json(result.responseBody)
})

export default router;