import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
const productCollection = 'product';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: String,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model(productCollection, productSchema);

