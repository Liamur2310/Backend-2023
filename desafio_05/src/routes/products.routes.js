import { response, Router } from "express";
import ProductsManager from "../managers/product_manager.js";

const router = Router();

const manager = new ProductsManager("../src/managers/productos.json");  //crea una instancia de prod man utilizando el archivo productos.json como alamacenamiento 

// get a /api/products que obtiene el listado de productos
router.get("/", (request, response)=>{
    const limit = request.query.limit;
    let products = manager.getProducts();

    if (limit){
        const limitNumber = parseInt(limit);
        if (!isNaN(limitNumber) && limitNumber > 0){
            products = products.slice(0, limitNumber);
        }
    }
    
    response.json(products);
})

// get a /api/products/:pid que obtiene un producto
router.get('/:pid', async (request, response) => {
     try{
         const productId = parseInt(request.params.pid);
         if (isNaN(productId)){
             response.status(400).json({error: `El parametro pid debe ser un numero entero`})
             return;
         }

         const product = await manager.getProductById(productId);

         if (!product){
             response.status(404).json({error: `No se encontro ningun producto con el Id ${productId}`});
             return;
         }
         response.json(product);
     }catch(eroror){
         console.log(error);
         response.status(500).json({error: `Error interno del servirdor`});   
     }
})


// post a /api/products/ que obtiene un producto
router.post('/', async (request, response) => {
    const{title, description, code, price, status, stock, category, thumbnails} = request.body

    let result = await manager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    response.status(result.status).json(result.responseBody)
})

// delete a /api/products/:pid que elimina un producto
router.delete('/:pid', async (request, response) => {
    const productId = parseInt(request.params.pid);

    let result = await manager.deleteProduct(productId);
    response.status(result.status).json(result.responseBody)
})

// put a /api/products/:pid que modifica un producto
router.put('/:pid', async (request, response) => {
    let productID = parseInt(request.params.pid);
    let productFields = request.body;
    let result = await manager.updateProduct(productID, productFields);
    response.status(result.status).json(result.responseBody)
})

export default router;