/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ICategory_s } from '../api/v1/Model';
import { useCategory_sStore } from '../store/Store';
import { baseICategory_s } from '../store/StoreConstants';
import { useGetCategory_sByIdQuery } from '../redux/rtk-Api';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedCategory_s, toggleViewModal, setSelectedCategory_s } = useCategory_sStore();
  const { data: Category_sData, refetch } = useGetCategory_sByIdQuery(selectedCategory_s?._id, { skip: !selectedCategory_s?._id });

  useEffect(() => {
    if (selectedCategory_s?._id) {
      refetch(); // Fetch the latest Category_s data
    }
  }, [selectedCategory_s?._id, refetch]);

  useEffect(() => {
    if (Category_sData?.data) {
      setSelectedCategory_s(Category_sData.data); // Update selectedCategory_s with the latest data
    }
  }, [Category_sData, setSelectedCategory_s]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{value || 'N/A'}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>
        </DialogHeader>
        {selectedCategory_s && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col">
              <div className="grid gap-2">
                <DetailRow label="Name" value={selectedCategory_s.name as string} />
                <div className="flex flex-col items-start justify-between gap-4 p-2 ">
                  {selectedCategory_s.subCategory &&
                    selectedCategory_s.subCategory.map((i, idx) => (
                      <p key={i + idx} className="text-sm flex items-start justify-between gap-2 p-2 w-full bg-slate-200 dark:bg-slate-800 rounded-md">
                        {i}
                      </p>
                    ))}
                </div>
                <DetailRow label="Created At" value={formatDate(selectedCategory_s.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(selectedCategory_s.updatedAt)} />
              </div>
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
            onClick={() => {
              toggleViewModal(false);
              setSelectedCategory_s({ ...baseICategory_s } as ICategory_s);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
