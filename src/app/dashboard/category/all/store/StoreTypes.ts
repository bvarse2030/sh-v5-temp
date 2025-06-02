// import { ICategory_s } from '@/app/api/v1/Category_s/filename7Model';
import { ICategory_s } from '../api/v1/Model';

export interface Category_sStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  category_s: ICategory_s[];
  selectedCategory_s: ICategory_s | null;
  newCategory_s: Partial<ICategory_s>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewCategory_s: React.Dispatch<React.SetStateAction<Partial<ICategory_s>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: ICategory_s[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setCategory_s: (Category_s: ICategory_s[]) => void;
  setSelectedCategory_s: (Category_s: ICategory_s | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Category_s: boolean) => void;
  toggleBulkUpdateModal: (Category_s: boolean) => void;
  toggleBulkDynamicUpdateModal: (Category_s: boolean) => void;
  toggleBulkDeleteModal: (Category_s: boolean) => void;
  setBulkData: (bulkData: ICategory_s[]) => void;
}
