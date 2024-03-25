//contiene las operaciones de acceso a datos para los usuarios

// userDao.js
import mongoose from 'mongoose';
import User from '../models/user';

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
    return user;
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  getUserById,
  getUserByUsername,
};
