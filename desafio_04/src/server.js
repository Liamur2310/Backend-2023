
import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = 8080;   //defino el puerto 

const app = express();

//midlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//ruta main
app.get("/", (require, response) =>{
    response.json({
        mensaje: "Bienvenido",
    })
});

//routes
app.use ("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//inicio el servidor
app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
})