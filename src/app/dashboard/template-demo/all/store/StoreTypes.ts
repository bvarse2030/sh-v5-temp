// import { IClots } from '@/app/api/v1/Clots/filename7Model';
import { IClots } from '../api/v1/Model';

export interface ClotsStore {
  queryPramsLimit: number;
  queryPramsPage: number;
  queryPramsQ: string;
  clots: IClots[];
  selectedClots: IClots | null;
  newClots: Partial<IClots>;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  setNewClots: React.Dispatch<React.SetStateAction<Partial<IClots>>>;
  isBulkEditModalOpen: boolean;
  isBulkUpdateModalOpen: boolean;
  isBulkDynamicUpdateModal: boolean;
  isBulkDeleteModalOpen: boolean;
  bulkData: IClots[];
  setQueryPramsLimit: (payload: number) => void;
  setQueryPramsPage: (payload: number) => void;
  setQueryPramsQ: (payload: string) => void;
  setClots: (Clots: IClots[]) => void;
  setSelectedClots: (Clots: IClots | null) => void;
  toggleAddModal: (isOpen: boolean) => void;
  toggleViewModal: (isOpen: boolean) => void;
  toggleEditModal: (isOpen: boolean) => void;
  toggleDeleteModal: (isOpen: boolean) => void;
  toggleBulkEditModal: (Clots: boolean) => void;
  toggleBulkUpdateModal: (Clots: boolean) => void;
  toggleBulkDynamicUpdateModal: (Clots: boolean) => void;
  toggleBulkDeleteModal: (Clots: boolean) => void;
  setBulkData: (bulkData: IClots[]) => void;
}
