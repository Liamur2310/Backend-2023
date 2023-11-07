class ProductManager {
    constructor(){
        this.products = [];
    }

    addProduct(title, description, price, thumbnail, code, stock){
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
    }

    getProducts (){
        return this.products;
    }

    // getProductById returns a product if exist and returns null when not exist
    getProductById (id){
        const product = this.products.find(product => product.id === id);
        if (product){
            return product;
        }

        console.log(`product with id ${id} not found`);
        return null;
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

const manager = new ProductManager();

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

const noExistenProduct = manager.getProductById(5);
if (!product) {
    console.log()
}