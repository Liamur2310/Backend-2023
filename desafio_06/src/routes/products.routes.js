import { response, Router } from "express";
import ProductsManager from "../managers/product_manager.js";
import { request } from "http";

const router = Router();

const manager = new ProductsManager("../src/managers/productos.json");  //crea una instancia de prod man utilizando el archivo productos.json como alamacenamiento 


router.use((req, res, next) => {
    console.log("Request:", req);
    next();
});


// get a /api/products que obtiene el listado de productos
//nuevo
router.get("/", (req, res)=> {
    try{
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

    //y aca aplico el ordenamiento si es que esta presente el query 
    if (sort) {
        if (sort === 'asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            products.sort((a, b) => b.price - a.price);
        }
    }

    //calculo el indice de inicio y fin para la paginacion
    const startIndex =  (page -1) *limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    
    // Calcular información para la respuesta
    const totalPages = Math.ceil(products.length / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = endIndex < products.length;
    const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null;

    //// Construir el objeto de respuesta
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
    
    res.json(responseObj);
}catch(error){
    console.log(error);
    res.status(500).json({status: 'error', error: 'Error interno del servidor '})
}
// res.json(paginatedProducts);
});


//anterior
/*router.get("/", (request, response)=>{
    const limit = request.query.limit;
    let products = manager.getProducts();

    if (limit){
        const limitNumber = parseInt(limit);
        if (!isNaN(limitNumber) && limitNumber > 0){
            products = products.slice(0, limitNumber);
        }
    }
    
    response.json(products);
})*/

// get a /api/products/:pid que obtiene un producto
router.get('/:pid', async (req, res) => {
     try{
         const productId = parseInt(req.params.pid);
         if (isNaN(productId)){
             res.status(400).json({error: `El parametro pid debe ser un numero entero`})
             return;
         }

         const product = await manager.getProductById(productId);

         if (!product){
             res.status(404).json({error: `No se encontro ningun producto con el Id ${productId}`});
             return;
         }
         res.json(product);
     }catch(error){
         console.log(error);
         res.status(500).json({error: `Error interno del servirdor`});   
     }
})


// post a /api/products/ que obtiene un producto
router.post('/', async (req, res) => {
    const{title, description, code, price, status, stock, category, thumbnails} = req.body

    let result = await manager.addProduct(title, description, code, price, status, stock, category, thumbnails);
    res.status(result.status).json(result.responseBody)
})

// delete a /api/products/:pid que elimina un producto
router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);

    let result = await manager.deleteProduct(productId);
    res.status(result.status).json(result.responseBody)
})

// put a /api/products/:pid que modifica un producto
router.put('/:pid', async (req, res) => {
    let productID = parseInt(req.params.pid);
    let productFields = req.body;
    let result = await manager.updateProduct(productID, productFields);
    res.status(result.status).json(result.responseBody)
})

export default router;
