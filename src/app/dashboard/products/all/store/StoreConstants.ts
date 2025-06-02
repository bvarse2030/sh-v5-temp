import { IProducts } from '../api/v1/Model';

export const baseIProductsPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIProductsPerPage };
export const pageLimitArr: number[] = [baseIProductsPerPage, 10, 50, 100, 200];
export const select: string = 'select';
export const productsSelectorArr = [select, 'admin', 'moderator'];
export type ISelect = 'select' | 'admin' | 'moderator';
export const defaultProductsData: IProducts = {
  _id: '',
  name: '',
  email: '',
  passCode: '',
  alias: '',
  role: select,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIProducts: IProducts = {
  ...defaultProductsData,
};
