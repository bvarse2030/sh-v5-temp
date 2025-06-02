/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';
import { productsSelectorArr, select } from '../../store/StoreConstants';

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    dataArr: [{ type: String, required: false }],
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    passCode: { type: String, required: true },
    alias: { type: String, required: true },
    role: {
      type: String,
      enum: productsSelectorArr,
      default: select,
    },
    images: [{ type: String }],
    descriptions: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);

export interface IProducts {
  name: string;
  dataArr?: string[];
  email: string;
  passCode: string;
  alias: string;
  role: string;
  images?: string[];
  descriptions?: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
