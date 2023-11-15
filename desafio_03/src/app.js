const { response } = require("express");
const express = require(`express`);  //importo el framework que facilita la creacion de servidores
const app = express(); // es una instancia para manejar y controlar las rutas 
const PORT = 5001;   //defino el puerto 

const {ProductManager} = require(`../ProductManager.js`);  //importa la clase 

const manager = new ProductManager ("./productos.json");  //crea una isntancia de prod man utilizando el archivo prod.json como alamacenamiento 

// ahora creo un endpoint para poner un limite estableciendo una ruta GET en /products 

app.get(`/products`, (require, response)=>{
    const {limit} = require.query;
    let products = manager.getProducts();

    if (limit){
        const limitNumber = parseInt(limit);
        if (!isNaN(limitNumber) && limitNumber > 0){
            products = products.slice(0, limitNumber);
        }
    }
    response.json(products);
})

app.get (`/products/:pid`, async (require, response) => { //pid significa el id del product
     try{
         const productId = parseInt(require.params.pid);
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




//inicio el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
})