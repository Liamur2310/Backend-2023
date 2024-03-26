//archivo que contiene funciones utiles compartidas

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const calculateTotalAmount = (products) => {
    return products.reduce((total, {product, quantity}) => {
        return total + (product.price * quantity);
    }, 0);
};


export default __dirname;
