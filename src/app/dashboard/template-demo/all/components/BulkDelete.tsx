/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useClotsStore } from '../store/Store';
import { useBulkDeleteClotsMutation } from '../redux/rtk-Api';

import { handleSuccess } from './utils';

const BulkDeleteNextComponents: React.FC = () => {
  const { isBulkDeleteModalOpen, toggleBulkDeleteModal, bulkData, setBulkData } = useClotsStore();
  const [bulkDeleteClots, { isLoading }] = useBulkDeleteClotsMutation();

  const handleBulkDeleteNextComponents = async () => {
    if (!bulkData?.length) return;
    try {
      const ids = bulkData.map(Clots => Clots._id);
      await bulkDeleteClots({ ids }).unwrap();
      toggleBulkDeleteModal(false);
      setBulkData([]);
      handleSuccess('Delete Successful');
    } catch (error) {
      console.error('Failed to delete Clots:', error);
    }
  };

  return (
    <Dialog open={isBulkDeleteModalOpen} onOpenChange={toggleBulkDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        {bulkData?.length > 0 && (
          <div className="pt-4">
            <p>
              You are about to delete <span className="font-semibold">({bulkData.length})</span> clots
            </p>
          </div>
        )}
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="flex flex-col">
            {bulkData.map((Clots, idx) => (
              <span key={(Clots._id as string) + idx} className="text-xs">
                {idx + 1}. {(Clots.name as string) || ''}
              </span>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={() => toggleBulkDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            className="text-rose-400 hover:text-rose-500 cursor-pointer bg-rose-100 hover:bg-rose-200 border-1 border-rose-300 hover:border-rose-400 "
            onClick={handleBulkDeleteNextComponents}
          >
            Delete Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkDeleteNextComponents;
