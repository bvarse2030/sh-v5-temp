import { create } from 'zustand';
import { ICategory_s } from '../api/v1/Model';
import { Category_sStore } from './StoreTypes';
import { baseICategory_s, queryParams } from './StoreConstants';

export const useCategory_sStore = create<Category_sStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  category_s: [],
  selectedCategory_s: null,
  newCategory_s: baseICategory_s,
  isBulkEditModalOpen: false,
  isBulkDynamicUpdateModal: false,
  isBulkUpdateModalOpen: false,
  isBulkDeleteModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  bulkData: [],
  setQueryPramsLimit: (payload: number) => set({ queryPramsLimit: payload }),
  setQueryPramsPage: (payload: number) => set({ queryPramsPage: payload }),
  setQueryPramsQ: (payload: string) => set({ queryPramsQ: payload }),
  setBulkData: (bulkData: ICategory_s[]) => set({ bulkData }),
  setCategory_s: (category_s: ICategory_s[]) => set({ category_s }),
  setSelectedCategory_s: Category_s => set({ selectedCategory_s: Category_s }),
  setNewCategory_s: Category_s =>
    set(state => ({
      newCategory_s: typeof Category_s === 'function' ? Category_s(state.newCategory_s) : Category_s,
    })),
  toggleAddModal: data => set({ isAddModalOpen: data }),
  toggleViewModal: data => set({ isViewModalOpen: data }),
  toggleEditModal: data => set({ isEditModalOpen: data }),
  toggleDeleteModal: data => set({ isDeleteModalOpen: data }),
  toggleBulkEditModal: data => set({ isBulkEditModalOpen: data }),
  toggleBulkUpdateModal: data => set({ isBulkUpdateModalOpen: data }),
  toggleBulkDynamicUpdateModal: data => set({ isBulkDynamicUpdateModal: data }),
  toggleBulkDeleteModal: data => set({ isBulkDeleteModalOpen: data }),
}));
