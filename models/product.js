import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: [String], // ✅ This is correct for array of image URLs
  createdOn: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

export default Product;

