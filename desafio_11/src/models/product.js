import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  state: { type: String, enum: ['active', 'inactive'], default: 'active' },
  stock: { type: Number, default: 0 },
  category: { type: String },
  thumbnails: [{ type: String }],
});

const Product = mongoose.model('Product', productSchema);

export default Product;
