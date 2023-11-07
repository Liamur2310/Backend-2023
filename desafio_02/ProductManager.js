const fs = require("fs");
const { json } = require("stream/consumers");

class ProductManager {
    constructor(path){
        this.path = path;
        if (!fs.existsSync(path)){
            this.products = [];
        }else{
            try{
                let products = fs.readFileSync(path, "utf-8");
                if (products.trim() === "") {
                    this.products = [];
                } else {
                    this.products = JSON.parse(products);
                }
            }catch(error){
                this.products = []
            }
        }
    }

    // guarda el array de productos en formato json en el archivo definido al momento de creacion del product manager
    async saveFile(){
        try {
            await fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'));
            return true
        }catch(error){
            console.log(error);
            return false
        }
    }

    // agrega un nuevo producto al listado y actualiza el file, ademas valida que el code exista y sea unico
    async addProduct(title, description, price, thumbnail, code, stock){
        if (!code){
            console.log("El campo 'code' es obligatorio ");
            return;
        }

        if (this.products.some(product => product.code === code)){
            console.log("El codigo ya existe. Debe ser unico.");
            return;
        }
        
        const product = new Product (title, description, price, thumbnail, code, stock);
        this.products.push(product);
        
        const result = await this.saveFile();
        if (result){
            console.log("Producto agregado");
        }else{
            console.log("Hubo un al error al guardar los productos");
        }
    }

    // obtiene del archivo de productos el contenido y lo devuelve en un array
    getProducts(){
        //let productsJSON = fs.readFileSync(this.path, "utf-8");
        //let products = JSON.parse(productsJSON);
        //return products;

        return this.products
    }

    // getProductById returns a product if exist and returns null when not exist
    getProductById (id){
        const product = this.products.find(product => product.id === id);
        if (!product){
            console.log(`product with id ${id} not found`);
            return null;
        }

        return product;
    }

    async updateProduct(producto){
        let productFromArray = this.products.find(prodInArray => prodInArray.id === producto.id);
        if (!productFromArray){
            console.log(`product with id ${producto.id} not found`);
            return null;
        }
        
        this.products.splice(producto.id - 1, 1, producto)
        const result = await this.saveFile(this.products);
        if (result){
            console.log("Producto agregado");
        }else{
            console.log("Hubo un al error al guardar los productos");
        }

        return producto
    }

    async deleteProduct(id){
        this.products.splice(id -1, 1);
        const result = await this.saveFile(this.products);
        if (result){
            console.log("Producto eliminado");
        }else{
            console.log("Hubo un al error al guardar los productos en el file");
        }
    }
};

class Product {

    static #idCounter = 1;
    // esta es otra forma de inicializar una variable privada
    // static idCounter = 1;

    constructor(title, description, price, thumbnail, code, stock){
        this.id = Product.#idCounter++,
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock;
    }
}

const manager = new ProductManager("./productos.json");

manager.addProduct("Zapatillas", "altas", 35000, "https://media.istockphoto.com/id/1420765979/es/foto/nuevas-zapatillas-juveniles-de-moda-sobre-un-fondo-de-piedra.jpg?s=1024x1024&w=is&k=20&c=mKauzbk4a3_7Gr9Ve2RZN-BNZCS297o1wbi_mrWlckg=", "P001", 50);
manager.addProduct("Remera", "estampada",  15000, "https://www.istockphoto.com/es/vector/dise%C3%B1o-de-camiseta-de-california-los-%C3%A1ngeles-dise%C3%B1o-de-estampado-de-camiseta-con-gm1326575447-411237126?phrase=remera+estampada", "P002", 23 );
manager.addProduct("Pantalon", "corte chino", 36000, "https://www.istockphoto.com/es/foto/pantalones-aislados-sobre-fondo-blanco-pantalones-colgantes-pantalones-chino-gm1294103843-388221174?phrase=pantalon+", "P003", 19);
manager.addProduct("Campera", "de jean, corte oversize", 30000, "https://www.istockphoto.com/es/foto/chaqueta-jean-aislada-sobre-blanco-vistas-delanteras-y-traseras-listo-para-el-trazado-gm1352728757-428055334?phrase=campera", "P004", 12);



console.log("Productos encontrados en la lista");
console.log(manager.getProducts());

const product = manager.getProductById(4);
if(product){
    console.log("Producto encontrado");
    console.log(product);
}

manager.getProductById(5);

manager.deleteProduct(3); 
const productosActualizados = manager.getProducts();
console.log("Productos actualizados");
console.log(productosActualizados);

manager.addProduct("mochila", "para computadora", 40000, "https://www.istockphoto.com/es/foto/en-la-escuela-gm176778805-10339224?phrase=mochila+para+computadora", "P005", 10);
