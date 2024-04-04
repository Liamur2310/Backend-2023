import Cart from '../../models/c';

class CartRepository {
  async createCart(cartData) {
    try {
      const newCart = new Cart(cartData);
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw new Error('Failed to create cart');
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId);
      return cart;
    } catch (error) {
      console.error('Error getting cart by ID:', error);
      throw new Error('Failed to get cart by ID');
    }
  }

  async updateCart(cartId, newData) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(cartId, newData, { new: true });
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw new Error('Failed to update cart');
    }
  }

  async deleteCart(cartId) {
    try {
      await Cart.findByIdAndDelete(cartId);
      return true;
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw new Error('Failed to delete cart');
    }
  }
}

export default new CartRepository();
