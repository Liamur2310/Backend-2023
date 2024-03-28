import * as fs from 'fs';


class CartsManager {
    static #id = 0;

    static #incrementID() {
        this.#id++;
    }

    static #setID(id) {
        this.#id = id;
    }

    constructor(path) {
        this.path = path;
        if (!fs.existsSync(path)) {
            this.carts = [];
        } else {
            try {
                let carts = fs.readFileSync(path, 'utf-8');
                if (carts.trim() === '') {
                    this.carts = [];
                } else {
                    this.carts = JSON.parse(carts);
                    let lastIndex = this.carts.length - 1;
                    let lastID = this.carts[lastIndex].id;
                    CartsManager.#setID(lastID++);
                }
            } catch (error) {
                console.log(error);
                this.carts = [];
            }
        }
    }

    async saveFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async addProduct(cartID, productID, quantity) {
        let cart = this.carts.find((cart) => cart.id === cartID);
        if (!cart) {
            return {
                status: 400,
                responseBody: {
                    error: `Cart with id ${cartID} not found`,
                },
            };
        }

        let productInCart = cart.products.find((product) => product.id === productID);
        if (!productInCart) {
            // Agregar el producto al carrito
            cart.products.push({ id: productID, quantity: quantity });
        } else {
            // Sumar la cantidad al producto existente en el carrito
            productInCart.quantity += quantity;
        }

        const cartIndex = this.carts.findIndex((cart) => cart.id === cartID);
        this.carts[cartIndex] = { ...this.carts[cartIndex], ...cart };
        await this.saveFile();

        return {
            status: 200,
            responseBody: {
                cart,
            },
        };
    }

    async removeProduct(cartID, productID) {
        let cart = this.carts.find((cart) => cart.id === cartID);
        if (!cart) {
            return {
                status: 400,
                responseBody: {
                    error: `Cart with id ${cartID} not found`,
                },
            };
        }

        // Filtrar los productos para eliminar el específico por ID
        cart.products = cart.products.filter((product) => product.id !== productID);

        const cartIndex = this.carts.findIndex((cart) => cart.id === cartID);
        this.carts[cartIndex] = { ...this.carts[cartIndex], ...cart };
        await this.saveFile();

        return {
            status: 200,
            responseBody: {
                cart,
            },
        };
    }

    async updateProductQuantity(cartID, productID, quantity) {
        let cart = this.carts.find((cart) => cart.id === cartID);
        if (!cart) {
            return {
                status: 400,
                responseBody: {
                    error: `Cart with id ${cartID} not found`,
                },
            };
        }

        let productInCart = cart.products.find((product) => product.id === productID);
        if (!productInCart) {
            return {
                status: 400,
                responseBody: {
                    error: `Product with id ${productID} not found in the cart`,
                },
            };
        }

        // Actualizar la cantidad del producto en el carrito
        productInCart.quantity = quantity;

        const cartIndex = this.carts.findIndex((cart) => cart.id === cartID);
        this.carts[cartIndex] = { ...this.carts[cartIndex], ...cart };
        await this.saveFile();

        return {
            status: 200,
            responseBody: {
                cart,
            },
        };
    }
}

export default CartsManager;
