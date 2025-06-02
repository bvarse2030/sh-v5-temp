import { create } from 'zustand';
import { IProducts } from '../api/v1/Model';
import { ProductsStore } from './StoreTypes';
import { baseIProducts, queryParams } from './StoreConstants';

export const useProductsStore = create<ProductsStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  products: [],
  selectedProducts: null,
  newProducts: baseIProducts,
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
  setBulkData: (bulkData: IProducts[]) => set({ bulkData }),
  setProducts: (products: IProducts[]) => set({ products }),
  setSelectedProducts: Products => set({ selectedProducts: Products }),
  setNewProducts: Products =>
    set(state => ({
      newProducts: typeof Products === 'function' ? Products(state.newProducts) : Products,
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
