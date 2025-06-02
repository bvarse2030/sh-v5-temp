// import { IProducts } from '@/app/api/v1/Products/filename7Model';
import { IProduct } from '../api/v1/Model';

export interface ProductsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  products: IProduct[];
  selectedProducts: IProduct | null;
  newProducts: Partial<IProduct>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewProducts: React.Dispatch<React.SetStateAction<Partial<IProduct>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IProduct[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setProducts: (Products: IProduct[]) => void;
  setSelectedProducts: (Products: IProduct | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Products: boolean) => void;
  toggleBulkUpdateModal: (Products: boolean) => void;
  toggleBulkDynamicUpdateModal: (Products: boolean) => void;
  toggleBulkDeleteModal: (Products: boolean) => void;
  setBulkData: (bulkData: IProduct[]) => void;
}
