import { IProduct, IImage, IReviewItem, IPickupPointItem, IAttributeItem, IShopInfoItem } from '../api/v1/Model'; // Ensure this path and these imports are correct for your project structure
import mongoose from 'mongoose'; // Needed for mongoose.Types.ObjectId if used directly

export const baseIProductsPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIProductsPerPage, category: '', status: '', sortBy: 'updatedAt', sortOrder: 'desc' };
export const pageLimitArr: number[] = [baseIProductsPerPage, 10, 20, 50, 100];
export const select: string = 'select';

export const productsSelectorArr = [select, 'admin', 'moderator'];
export type ISelect = 'select' | 'admin' | 'moderator';

export const defaultProductStatus = 'coming-soon';
export const productStatusOptions: IProduct['productStatus'][] = ['active', 'coming-soon', 'disabled', 'out-of-stock'];

export const defaultProductsData: IProduct = {
  _id: '',
  productUID: '',
  name: '',
  description: '',
  image: {
    imageFor: '',
    imgURL: '',
  } as IImage,
  realPrice: 0,
  discountPrice: 0,
  reviews: [] as IReviewItem[],
  color: '',
  category: '',
  pickupPoints: [] as IPickupPointItem[],
  attributes: [] as IAttributeItem[],
  productStatus: defaultProductStatus,
  totalSells: 0,
  shopsInfo: [] as IShopInfoItem[],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const baseIProducts: IProduct = {
  ...defaultProductsData,
};
