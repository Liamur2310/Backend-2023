import Ticket from './models/ticket.js';
import Cart from './models/cart.js';
import Product from './models/product.js'; 
import { calculateTotalAmount } from '../utils.js';

const PurchaseController = {
    async finalizePurchase(cartId, purchaserEmail) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error(`Cart with id ${cartId} not found`);
            }

            let totalAmount = 0;
            let productsNotBought = [];
            let productsBought = [];

            // Itera sobre los productos del carrito para verificar el stock
            for (let item of cart.products) {
                const product = await Product.findById(item.product._id);
                if (product.stock >= item.quantity) {
                    totalAmount += product.price * item.quantity;
                    product.stock -= item.quantity;
                    await product.save();
                    productsBought.push(item);
                } else {
                    productsNotBought.push(item);
                }
            }

            let savedTicket;
            if (productsBought.length > 0) {
                // Genera un código único para el ticket
                const ticketCode = generateTicketCode();

                // Crea un nuevo ticket solo con los productos que se pudieron comprar
                const newTicket = new Ticket({
                    code: ticketCode,
                    purchase_datetime: new Date(),
                    amount: totalAmount,
                    purchaser: purchaserEmail,

                });

                // Guarda el nuevo ticket en la base de datos
                savedTicket = await newTicket.save();
            }

            // Actualiza el carrito para mantener solo los productos que no se pudieron comprar
            cart.products = productsNotBought;
            await cart.save();

            return { ticket: savedTicket, productsNotBought };
        } catch (error) {
            throw error;
        }
    }
};

function generateTicketCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 10;
    let code = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

export default PurchaseController;


