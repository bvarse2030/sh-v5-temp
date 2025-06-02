/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import mongoose, { Schema, Document } from 'mongoose';

export interface IImage {
  imageFor: string;
  imgURL: string;
}
export const imageSchema = new Schema<IImage>(
  {
    imageFor: { type: String },
    imgURL: { type: String },
  },
  { _id: false },
);

export interface IReviewItem {
  review: string;
  name: string;
  userUID: string;
}
export const reviewItemSchema = new Schema<IReviewItem>(
  {
    review: { type: String },
    name: { type: String },
    userUID: { type: String },
  },
  { _id: false },
);

export interface IPickupPointItem {
  pickupPointsUID: string;
  name: string;
}
export const pickupPointItemSchema = new Schema<IPickupPointItem>(
  {
    pickupPointsUID: { type: String },
    name: { type: String },
  },
  { _id: false },
);

export interface IAttributeItem {
  attributesUID: string;
  name: string;
}
export const attributeItemSchema = new Schema<IAttributeItem>(
  {
    attributesUID: { type: String },
    name: { type: String },
  },
  { _id: false },
);

export interface IShopInfoItem {
  shopName: string;
  shopUID: string;
}
export const shopInfoItemSchema = new Schema<IShopInfoItem>(
  {
    shopName: { type: String },
    shopUID: { type: String },
  },
  { _id: false },
);

export const productSchema = new Schema(
  {
    productUID: { type: String, unique: true },
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    image: { type: imageSchema },
    realPrice: { type: Number, min: 0 },
    discountPrice: { type: Number, min: 0 },
    reviews: { type: [reviewItemSchema], default: [] },
    color: { type: String, trim: true },
    category: { type: String, trim: true },
    pickupPoints: { type: [pickupPointItemSchema], default: [] },
    attributes: { type: [attributeItemSchema], default: [] },
    productStatus: {
      type: String,
      enum: ['disabled', 'out-of-stock', 'coming-soon', 'active'],
      default: 'coming-soon',
    },
    totalSells: { type: Number, default: 0 },
    shopsInfo: { type: [shopInfoItemSchema], default: [] },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, productStatus: 1 });
productSchema.index({ name: 'text', description: 'text' });

export interface IProduct {
  _id?: string;
  productUID?: string;
  name?: string;
  description?: string;
  image?: IImage;
  realPrice?: number;
  discountPrice?: number;
  reviews?: IReviewItem[];
  color?: string;
  category: string;
  pickupPoints?: IPickupPointItem[];
  attributes?: IAttributeItem[];
  productStatus: 'disabled' | 'out-of-stock' | 'coming-soon' | 'active';
  totalSells?: number;
  shopsInfo?: IShopInfoItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default ProductModel;
