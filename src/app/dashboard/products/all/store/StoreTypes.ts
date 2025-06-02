// import { IProducts } from '@/app/api/v1/Products/filename7Model';
import { IProducts } from '../api/v1/Model';

export interface ProductsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  products: IProducts[];
  selectedProducts: IProducts | null;
  newProducts: Partial<IProducts>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewProducts: React.Dispatch<React.SetStateAction<Partial<IProducts>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IProducts[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setProducts: (Products: IProducts[]) => void;
  setSelectedProducts: (Products: IProducts | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Products: boolean) => void;
  toggleBulkUpdateModal: (Products: boolean) => void;
  toggleBulkDynamicUpdateModal: (Products: boolean) => void;
  toggleBulkDeleteModal: (Products: boolean) => void;
  setBulkData: (bulkData: IProducts[]) => void;
}
