//maneja la logica relacionada con el carrito
import CartsDao from '../dao/cartsDao.js';

class CartsController {
    constructor(cartsDao) {
        this.cartsDao = cartsDao;
    }

    async addProduct(cartID, productID, quantity) {
        try {
            // Obtener la lista de carritos desde el archivo
            const carts = await this.cartsDao.readFile();

            // Lógica para agregar productos al carrito
            let cart = carts.find((cart) => cart.id === cartID);
            if (!cart) {
                return {
                    status: 400,
                    responseBody: {
                        error: `Cart with id ${cartID} not found`,
                    },
                };
            }

            let productInCart = cart.products.find(
                (product) => product.id === productID
            );
            if (!productInCart) {
                // Agregar el producto al carrito
                cart.products.push({ id: productID, quantity: quantity });
            } else {
                // Sumar la cantidad al producto existente en el carrito
                productInCart.quantity += quantity;
            }

            // Guardar la lista actualizada de carritos en el archivo
            await this.cartsDao.saveFile(carts);

            return {
                status: 200,
                responseBody: {
                    cart,
                },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                responseBody: {
                    error: 'Internal Server Error',
                },
            };
        }
    }

    async removeProduct(cartID, productID) {
        try {
            // Obtener la lista de carritos desde el archivo
            const carts = await this.cartsDao.readFile();

            // Lógica para eliminar un producto del carrito
            let cart = carts.find((cart) => cart.id === cartID);
            if (!cart) {
                return {
                    status: 400,
                    responseBody: {
                        error: `Cart with id ${cartID} not found`,
                    },
                };
            }

            // Filtrar los productos para eliminar el específico por ID
            cart.products = cart.products.filter(
                (product) => product.id !== productID
            );

            // Guardar la lista actualizada de carritos en el archivo
            await this.cartsDao.saveFile(carts);

            return {
                status: 200,
                responseBody: {
                    cart,
                },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                responseBody: {
                    error: 'Internal Server Error',
                },
            };
        }
    }

    async updateProductQuantity(cartID, productID, quantity) {
        try {
            // Obtener la lista de carritos desde el archivo
            const carts = await this.cartsDao.readFile();

            // Lógica para actualizar la cantidad de un producto en el carrito
            let cart = carts.find((cart) => cart.id === cartID);
            if (!cart) {
                return {
                    status: 400,
                    responseBody: {
                        error: `Cart with id ${cartID} not found`,
                    },
                };
            }

            let productInCart = cart.products.find(
                (product) => product.id === productID
            );
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

            // Guardar la lista actualizada de carritos en el archivo
            await this.cartsDao.saveFile(carts);

            return {
                status: 200,
                responseBody: {
                    cart,
                },
            };
        } catch (error) {
            console.log(error);
            return {
                status: 500,
                responseBody: {
                    error: 'Internal Server Error',
                },
            };
        }
    }
}

export default CartsController;
