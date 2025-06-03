/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React, { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { IProduct } from '../api/v1/Model';
import { useProductsStore } from '../store/Store';
import { useUpdateProductsMutation } from '../redux/rtk-Api';
import { productsSelectorArr, baseIProducts } from '../store/StoreConstants';

import DataSelect from './DataSelect';
import ImagesSelect from './ImagesSelect';
import RichTextEditor from './rich-text-editor';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditNextComponents: React.FC = () => {
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const { toggleEditModal, isEditModalOpen, newProducts, selectedProducts, setNewProducts, setSelectedProducts } = useProductsStore();
  const [updateProducts] = useUpdateProductsMutation();
  const [descriptions, setDescriptions] = useState('');

  const onChange = (content: string) => {
    setDescriptions(content);
  };
  useEffect(() => {
    if (selectedProducts) {
      setNewProducts(selectedProducts);
    }
  }, [selectedProducts, setNewProducts]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProducts({ ...newProducts, [name]: value });
  };
  const handleRoleChange = () => {
    setNewProducts({ ...newProducts });
  };

  const handleEditNextComponents = async () => {
    if (!selectedProducts) return;

    try {
      const updateData = { ...newProducts, dataArr: newItemTags, images: newImages };
      await updateProducts({ id: selectedProducts._id, ...updateData }).unwrap(); // Call RTK mutation
      toggleEditModal(false);
      handleSuccess('Edit Successful');
    } catch (error: unknown) {
      let errMessage: string = '';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message);
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Products</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" name="name" value={(newProducts.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input id="edit-email" name="email" type="email" value={(newProducts.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-passCode" className="text-right">
                Pass Code
              </Label>
              <Input
                id="edit-passCode"
                name="passCode"
                type="password"
                value={(newProducts.name as string) || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-alias" className="text-right">
                Alias
              </Label>
              <Input id="edit-alias" name="alias" value={(newProducts.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>

              <Select onValueChange={handleRoleChange} defaultValue={(newProducts.name as string) || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {productsSelectorArr?.map((i, index) => (
                    <SelectItem key={i + index} className="cursor-pointer " value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DataSelect newItemTags={newItemTags as string[]} setNewItemTags={setNewItemTags} />
          </div>
          <ImagesSelect newImages={newImages as string[]} setNewImages={setNewImages} />
          <div className="w-full mt-2" />

          <RichTextEditor content={descriptions} onChange={onChange} />
          <div className="mt-12 pt-12" />
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedProducts({ ...baseIProducts } as IProduct);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleEditNextComponents} variant="outlineGarden">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNextComponents;
