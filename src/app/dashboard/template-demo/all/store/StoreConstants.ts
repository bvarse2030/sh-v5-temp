import { IClots } from '../api/v1/Model';

export const baseIClotsPerPage = 2;
export const queryParams = { q: '', page: 1, limit: baseIClotsPerPage };
export const pageLimitArr: number[] = [baseIClotsPerPage, 10, 50, 100, 200];
export const select: string = 'select';
export const clotsSelectorArr = [select, 'admin', 'moderator'];
export type ISelect = 'select' | 'admin' | 'moderator';
export const defaultClotsData: IClots = {
  _id: '',
  name: '',
  email: '',
  passCode: '',
  alias: '',
  role: select,
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const baseIClots: IClots = {
  ...defaultClotsData,
};
