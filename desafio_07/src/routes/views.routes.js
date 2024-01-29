import { Router } from "express";
import ProductsManager from "../managers/product_manager.js";

const router = Router();

const manager = new ProductsManager("./src/managers/productos.json");  //crea una instancia de prod man utilizando el archivo productos.json como alamacenamiento 

router.get('/', (req, res)=>{
    res.render('home', {products: manager.getProducts()});
});
  
router.get('/realtimeproducts', (req, res) => {
    try {
        // Lógica para obtener la lista de productos y el nombre de usuario
        const username = req.session.user ? req.session.user.username : 'Invitado';

        // Renderizar realTimeProducts.hbs con la lista de productos y el nombre de usuario
        res.render('realTimeProducts', { products: manager.getProducts(), username });
    } catch (error) {
        console.error('Error al renderizar la vista:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;