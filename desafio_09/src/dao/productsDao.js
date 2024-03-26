//contiene las operaciones de acceso a datos para los productos

import mongoose from 'mongoose';
import Product from '../models/product';

// Operaciones de acceso a datos relacionadas con productos (usando Mongoose)
const createProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw error;
  }
};

export default {
  createProduct,
  getProductById,
  getAllProducts,
};
