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

import { IProduct } from '../api/v1/Model';
import { useProductsStore } from '../store/Store';
import { baseIProducts } from '../store/StoreConstants';
import { useGetProductsByIdQuery } from '../redux/rtk-Api';

import { ViewRichText } from './view-rich-text/ViewRichText';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedProducts, toggleViewModal, setSelectedProducts } = useProductsStore();
  const { data: ProductsData, refetch } = useGetProductsByIdQuery(selectedProducts?._id, { skip: !selectedProducts?._id });

  useEffect(() => {
    if (selectedProducts?._id) {
      refetch(); // Fetch the latest Products data
    }
  }, [selectedProducts?._id, refetch]);

  useEffect(() => {
    if (ProductsData?.data) {
      setSelectedProducts(ProductsData.data); // Update selectedProducts with the latest data
    }
  }, [ProductsData, setSelectedProducts]);

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
          <DialogTitle>Products Details</DialogTitle>
        </DialogHeader>
        {selectedProducts && (
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="w-full flex flex-col">
              <div className="grid gap-2">
                <DetailRow label="Name" value={selectedProducts.name as string} />
                <DetailRow
                  label="Role"
                  value={
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedProducts.name === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : selectedProducts.name === 'moderator'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {selectedProducts.name as string}
                    </span>
                  }
                />
                <DetailRow label="Created At" value={formatDate(selectedProducts.createdAt)} />
                <DetailRow label="Updated At" value={formatDate(selectedProducts.updatedAt)} />
              </div>

              <div className="w-full m-2" />
              <ViewRichText data={selectedProducts.name || ''} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button
            className="cursor-pointer border-1 border-slate-400 hover:border-slate-500"
            onClick={() => {
              toggleViewModal(false);
              setSelectedProducts({ ...baseIProducts } as IProduct);
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
