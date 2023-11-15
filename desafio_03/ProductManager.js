const fs = require("fs");
const { json } = require("stream/consumers");

class ProductManager {
    static #id = 1;

    static #incrementID() {
        this.#id++; 
    }

    static #setID(id) {
        this.#id = id; 
    }

    idCounter = 1;

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
                    lastIndex = this.products.length - 1;
                    ProductManager.#setID(this.products[lastIndex].id++);
                }
            }catch(error){
                console.log(error);
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

        console.log("productos en addProduct:");
        console.log(this.products);        
        if (this.products.some(product => product.code === code)){
            console.log("El codigo ya existe. Debe ser unico.");
            return;
        }
        ProductManager.#incrementID();
        const product = new Product (ProductManager.#id, title, description, price, thumbnail, code, stock);
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

   /* async updateProduct(producto){
        let productFromArray = this.products.find(prodInArray => prodInArray.id === producto.id);
        if (!productFromArray){
            console.log(`product with id ${producto.id} not found`);
            return null;
        }*/

    async updateProduct (id, updateProduct){
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updateProduct };
            await this.saveFile();
            return true;
        }
       
        return false;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveFile();
            return true;
        }
        
        return false;
    }  

   /* async deleteProduct(id){
        this.products.splice(id -1, 1);
        const result = await this.saveFile(this.products);
        if (result){
            console.log("Producto eliminado");
        }else{
            console.log("Hubo un al error al guardar los productos en el file");
        }
    }*/
};

class Product {
    constructor(id, title, description, price, thumbnail, code, stock){
        this.id = id,
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock;
    }
}

module.exports = {ProductManager};

const manager = new ProductManager("./productos.json");

manager.addProduct("Zapatillas", "altas", 35000, "https://media.istockphoto.com/id/1420765979/es/foto/nuevas-zapatillas-juveniles-de-moda-sobre-un-fondo-de-piedra.jpg?s=1024x1024&w=is&k=20&c=mKauzbk4a3_7Gr9Ve2RZN-BNZCS297o1wbi_mrWlckg=", "P001", 50);
manager.addProduct("Remera", "estampada",  15000, "https://www.istockphoto.com/es/vector/dise%C3%B1o-de-camiseta-de-california-los-%C3%A1ngeles-dise%C3%B1o-de-estampado-de-camiseta-con-gm1326575447-411237126?phrase=remera+estampada", "P002", 23 );
manager.addProduct("Pantalon", "corte chino", 36000, "https://www.istockphoto.com/es/foto/pantalones-aislados-sobre-fondo-blanco-pantalones-colgantes-pantalones-chino-gm1294103843-388221174?phrase=pantalon+", "P003", 19);
manager.addProduct("Campera", "de jean, corte oversize", 30000, "https://www.istockphoto.com/es/foto/chaqueta-jean-aislada-sobre-blanco-vistas-delanteras-y-traseras-listo-para-el-trazado-gm1352728757-428055334?phrase=campera", "P004", 12);


console.log("Productos encontrados en la lista");
console.log(manager.getProducts());

const product4 = manager.getProductById(4);
if(product4){
    console.log("Producto 4 encontrado");
    console.log(product4);
}

const product5 = manager.getProductById(5);
if(product5){
    console.log("Producto 5 encontrado");
    console.log(product5);
} else {
    console.log("Producto 5 no encontrado");
}


if (manager.deleteProduct(3)) {
    console.log("Producto 3 eliminado");
} else {
    console.log("Problemas al eliminar el producto 3");
}

const productosActualizados = manager.getProducts();

console.log("Productos actualizados sin el 3");
console.log(productosActualizados);

// este deberia ser el 5
manager.addProduct("mochila", "para computadora", 40000, "https://www.istockphoto.com/es/foto/en-la-escuela-gm176778805-10339224?phrase=mochila+para+computadora", "P005", 10);
