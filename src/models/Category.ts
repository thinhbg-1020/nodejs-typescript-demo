import mongoose from 'mongoose';
import { Category as ICategory } from '../types/category';

const Schema = mongoose.Schema;

export type CategoryModel = mongoose.Document & ICategory;

const categoryModelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date()
  }
});

const Category = mongoose.model<CategoryModel>('Category', categoryModelSchema);

export default Category;
