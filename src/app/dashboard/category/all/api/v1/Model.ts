/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String },
    subCategory: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.models.Category || mongoose.model('Category', categorySchema);

export interface ICategory_s {
  name: string;
  subCategory?: string[];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
