import * as fs from 'fs';

class ProductManager {
    static #id = 1;

    static #incrementID() {
        this.#id++; 
    }

    static #setID(id) {
        this.#id = id; 
    }

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
                    let lastIndex = this.products.length - 1;
                    let lastID = this.products[lastIndex].id
                    ProductManager.#setID(lastID++);
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
    async addProduct(title, description, code, price, status, stock, category, thumbnails) {
        if (!this.areFieldsValid(title, description, code, price, status, stock, category)) {
            return {
                status: 400,
                responseBody: {
                    error: "Invalid parameters"
                }
            };
        }

        if (this.products.some(product => product.code === code)){
            console.log("El codigo ya existe. Debe ser unico.");
            return {
                status: 400,
                responseBody: {
                    error: "Invalid code"
                }
            };
        }

        ProductManager.#incrementID();
        const product = new Product(ProductManager.#id, title, description, code, price, status, stock, category, thumbnails);
        this.products.push(product);
        
        const result = await this.saveFile();
        if (result){
            console.log("Producto agregado");
            return {
                status: 201,
                responseBody: {
                    product
                }
            };
        }
        
        console.log("Hubo un al error al guardar los productos");
        return {
            status: 500,
            responseBody: {
                error: "Internal Server Error"
            }
        };
    }

    // obtiene del archivo de productos el contenido y lo devuelve en un array
    getProducts(){
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

    async updateProduct (id, updateProduct){
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            const productoOriginalModificado = this.products[index];
            
            if (updateProduct.title){
                productoOriginalModificado.title = updateProduct.title;
            }
    
            if (updateProduct.description){
                productoOriginalModificado.description = updateProduct.description;
            }

            if (updateProduct.code){
                productoOriginalModificado.code = updateProduct.code;
            }

            if (updateProduct.price){
                productoOriginalModificado.price = updateProduct.price;
            }

            if (updateProduct.status){
                productoOriginalModificado.status = updateProduct.status;
            }

            if (updateProduct.stock){
                productoOriginalModificado.stock = updateProduct.stock;
            }
            
            if (updateProduct.category){
                productoOriginalModificado.title = updateProduct.category;
            }

            if (updateProduct.thumbnails){
                productoOriginalModificado.thumbnails = updateProduct.thumbnails;
            }

            // reemplazo el producto original por el nuevo modificado
            this.products[index] = { ...this.products[index], ...productoOriginalModificado };
            await this.saveFile();

            let productoGuardadoYModificado = this.products[index]
            return {
                status: 200,
                responseBody: {
                    productoGuardadoYModificado
                }
            };
        }
       
        return {
            status: 400,
            responseBody: {
                error: `Producto con id ${id} no encontrado`
            }
        };
    }

    async deleteProduct(id) {
        const index = this.products.findIndex((product) => product.id === id);
        if (index !== -1) {
            let productDeleted = this.products.splice(index, 1);
            await this.saveFile();
            return {
                status: 200,
                responseBody: {
                    productDeleted
                }
            };
        }
        
        return {
            status: 400,
            responseBody: {
                error: `Producto con id ${id} no encontrado`
            }
        };
    }  

    areFieldsValid(title, description, code, price, status, stock, category) {
        if (!title){
            console.log("El campo 'title' es obligatorio ");
            return false;
        }

        if (!description){
            console.log("El campo 'description' es obligatorio ");
            return false;
        }

        if (!code){
            console.log("El campo 'code' es obligatorio ");
            return false;
        }

        if (!price){
            console.log("El campo 'price' es obligatorio ");
            return false;
        }

        if (!status){
            console.log("El campo 'status' es obligatorio ");
            return false;
        }

        if (!stock){
            console.log("El campo 'stock' es obligatorio ");
            return false;
        }

        if (!category){
            console.log("El campo 'category' es obligatorio ");
            return false;
        }

        return true;
    }
};

class Product {
    constructor(id, title, description, code, price, status, stock, category, thumbnails){
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

export default ProductManager;