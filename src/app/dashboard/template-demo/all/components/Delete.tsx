/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ICategory_s } from '../api/v1/Model';
import { useCategory_sStore } from '../store/Store';
import { baseICategory_s } from '../store/StoreConstants';
import { useDeleteCategory_sMutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const DeleteNextComponents: React.FC = () => {
  const { toggleDeleteModal, isDeleteModalOpen, selectedCategory_s, setSelectedCategory_s } = useCategory_sStore();
  const [deleteCategory_s] = useDeleteCategory_sMutation();

  const handleDeleteCategory_s = async () => {
    if (selectedCategory_s) {
      try {
        await deleteCategory_s({ id: selectedCategory_s._id }).unwrap();
        toggleDeleteModal(false);
        handleSuccess('Delete Successful');
      } catch (error) {
        console.error('Failed to delete Category_s:', error);
      }
    }
  };

  const handleCancel = () => {
    toggleDeleteModal(false);
    setSelectedCategory_s({ ...baseICategory_s } as ICategory_s);
  };

  const { name = '' } = selectedCategory_s || {};

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={toggleDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {selectedCategory_s && (
          <div className="py-4">
            <p>
              You are about to delete Category_s: <span className="font-semibold">{(name as string) || ''}</span>
            </p>
          </div>
        )}
        <DialogFooter>
          <Button className="cursor-pointer border-1 border-slate-400 hover:border-slate-500" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="text-rose-400 hover:text-rose-500 cursor-pointer bg-rose-100 hover:bg-rose-200 border-1 border-rose-300 hover:border-rose-400 "
            variant="outline"
            onClick={handleDeleteCategory_s}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNextComponents;
