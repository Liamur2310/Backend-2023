import { Router } from "express";
import ProductsManager from "../managers/product_manager.js";

const router = Router();

const manager = new ProductsManager("./src/managers/productos.json");  //crea una instancia de prod man utilizando el archivo productos.json como alamacenamiento 

router.get('/', (req, res)=>{
    res.render('home', {products: manager.getProducts()});
});
  

router.get('/realtimeproducts', (req, res) => {
    // Lógica para obtener la lista de productos y renderizar realTimeProducts.handlebars
    res.render('realTimeProducts', {products: manager.getProducts()});
});

export default router;