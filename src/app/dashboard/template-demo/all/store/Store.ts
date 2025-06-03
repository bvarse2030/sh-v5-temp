import { create } from 'zustand';
import { IClots } from '../api/v1/Model';
import { ClotsStore } from './StoreTypes';
import { baseIClots, queryParams } from './StoreConstants';

export const useClotsStore = create<ClotsStore>(set => ({
  queryPramsLimit: queryParams.limit,
  queryPramsPage: queryParams.page,
  queryPramsQ: queryParams.q,
  clots: [],
  selectedClots: null,
  newClots: baseIClots,
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
  setBulkData: (bulkData: IClots[]) => set({ bulkData }),
  setClots: (clots: IClots[]) => set({ clots }),
  setSelectedClots: Clots => set({ selectedClots: Clots }),
  setNewClots: Clots =>
    set(state => ({
      newClots: typeof Clots === 'function' ? Clots(state.newClots) : Clots,
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
