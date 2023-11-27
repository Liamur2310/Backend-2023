import * as fs from 'fs';

class CartManager {
    static #id = 0;

    static #incrementID() {
        this.#id++; 
    }

    static #setID(id) {
        this.#id = id; 
    }

    constructor(path){
        this.path = path;
        if (!fs.existsSync(path)){
            this.carts = [];
        }else{
            try{
                let carts = fs.readFileSync(path, "utf-8");
                if (carts.trim() === "") {
                    this.carts = [];
                } else {
                    this.carts = JSON.parse(carts);
                    let lastIndex = this.carts.length - 1;
                    let lastID = this.carts[lastIndex].id
                    CartManager.#setID(lastID++);
                }
            }catch(error){
                console.log(error);
                this.carts = []
            }
        }
    }
   

    async saveFile(){
        try {
            await fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'));
            return true
        }catch(error){
            console.log(error);
            return false
        }
    }

    async addProduct(cartID, productID, quantity) {
        let cart = this.carts.find(cart => cart.id === cartID);
        if (!cart){
            return {
                status: 400,
                responseBody: {
                    error: `cart with id ${cartID} not found`
                }
            };
        }

        let productInCart = cart.products.find(product => product.id === productID);
        if (!productInCart){
            // agregarlo
            cart.products.push({id: productID, quantity: quantity})
        } else {
            // sumar el quantity al anterior
            productInCart.quantity += quantity
            //const productIndex = cart.products.findIndex((product) => product.id === id);
            //cart.products[index] = { ...cart.products[index], ...productInCart };
        }

        const cartIndex = this.carts.findIndex((cart) => cart.id === cartID)
        this.carts[cartIndex] = { ...this.carts[cartIndex], ...cart};
        await this.saveFile();
        
        return {
            status: 200,
            responseBody: {
                cart
            }
        }
    }

    async generateCart() {
        let products = []
        CartManager.#incrementID();
        const cart = new Cart(CartManager.#id, products);
        this.carts.push(cart);
        
        const result = await this.saveFile();
        if (result){
            console.log("Cart generado");
            return {
                status: 201,
                responseBody: {
                    cart
                }
            };
        }
        
        console.log("Hubo un al error al generar el cart");
        return {
            status: 500,
            responseBody: {
                error: "Internal Server Error"
            }
        };
    }

    geCartById (id){
        const cart = this.carts.find(cart => cart.id === id);
        if (!cart){
            console.log(`cart with id ${id} not found`);
            return {
                status: 400,
                responseBody: {
                    error: `cart with id ${id} not found`
                }
            };
        }

        return  {
            status: 200,
            responseBody: {
                cart
            }
        };
    }
};

class Cart {
    constructor(id, products){
        this.id = id;
        this.products = products;
    }
}

export default CartManager;