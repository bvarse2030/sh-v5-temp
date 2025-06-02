/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import Image from 'next/image';
import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { ICategory_s } from '../api/v1/Model';
import { useCategory_sStore } from '../store/Store';
import { baseICategory_s } from '../store/StoreConstants';
import { useGetCategory_sByIdQuery } from '../redux/rtk-Api';

import { ViewRichText } from './view-rich-text/ViewRichText';

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
  const DetailRowArray = ({ label, values }: { label: string; values: string[] }) => (
    <div className="grid grid-cols-3 gap-2">
      <div className="font-semibold">{label}:</div>
      <div className="col-span-2">{values?.join(', ')}</div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category_s Details</DialogTitle>
        </DialogHeader>
        {selectedCategory_s && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col">
              <div className="grid gap-2">
                <DetailRow label="Name" value={selectedCategory_s.name as string} />
                <DetailRow label="Email" value={selectedCategory_s.email as string} />
                <DetailRow label="Pass Code" value={selectedCategory_s.passCode as string} />
                <DetailRow label="Alias" value={selectedCategory_s.alias as string} />
                <DetailRow
                  label="Role"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCategory_s.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedCategory_s.role === 'moderator'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedCategory_s.role as string}
                    </span>
                  }
                />
                <DetailRowArray label="Data Array" values={selectedCategory_s.dataArr as string[]} />
                <DetailRow label="Created At" value={formatDate(selectedCategory_s.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(selectedCategory_s.updatedAt)} />
              </div>
              <div className="w-full flex items-center justify-center mt-2 min-h-[10vh]">
                {Array.isArray(selectedCategory_s.images) && selectedCategory_s.images?.length > 0 ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1">
                    {selectedCategory_s.images.map((i, index) => (
                      <div
                        key={index + i}
                        className={`relative w-full h-[150px] border-1 border-slate-300 shadow-xl hover:shadow-2xl cursor-pointer hover:border-slate-600 flex items-center justify-center rounded-lg overflow-hidden`}
                      >
                        <Image src={i} fill alt="Media" objectFit="cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col w-full items-center justify-center">
                    <p>Ops! there is no Image</p>
                  </div>
                )}
              </div>
              <div className="w-full m-2" />
              <ViewRichText data={selectedCategory_s.descriptions || ''} />
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
