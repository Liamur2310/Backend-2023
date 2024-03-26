// productRepository.js
import Product from '../models/product.js';
import ProductRepositoryInterface from './productRepositoryInterface.js';

class ProductRepository extends ProductRepositoryInterface {
  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, newData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, newData, { new: true });
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductRepository();
