// userDao.js
import User from '../models/user.js';

// DTO para el usuario
const userDTO = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,

  };
};

// Operaciones de acceso a datos relacionadas con usuarios (usando Mongoose)
const createUser = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return userDTO(user); // Devolver DTO del usuario
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return userDTO(user); // Devolver DTO del usuario
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  getUserById,
  getUserByUsername,
};
