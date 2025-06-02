import { ICategory_s } from '../api/v1/Model';

export const baseICategory_sPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseICategory_sPerPage };
export const pageLimitArr: number[] = [baseICategory_sPerPage, 10, 50, 100, 200];
export const defaultCategory_sData: ICategory_s = {
  _id: '',
  name: '',
  subCategory: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseICategory_s: ICategory_s = {
  ...defaultCategory_sData,
};
