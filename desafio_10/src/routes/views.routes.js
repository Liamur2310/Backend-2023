// Define las rutas relacionadas con las vistas
import { Router } from "express";
import ProductRepository from "../repository/productRepository.js"; 
const router = Router();

const repository = ProductRepository; // Crea una instancia de ProductRepository

router.get('/', (req, res)=>{
    res.render('home', { products: repository.getAllProducts() }); 
});
  
router.get('/realtimeproducts', (req, res) => {
    try {
        // Lógica para obtener la lista de productos y el nombre de usuario
        const username = req.session.user ? req.session.user.username : 'Invitado';

        // Renderizar realTimeProducts.hbs con la lista de productos y el nombre de usuario
        res.render('realTimeProducts', { products: repository.getAllProducts(), username });
    } catch (error) {
        console.error('Error al renderizar la vista:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default router;
