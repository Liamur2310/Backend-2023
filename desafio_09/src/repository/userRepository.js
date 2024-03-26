// userRepository.js
import User from '../models/user.js';

class UserRepository {
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, newData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      await User.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
