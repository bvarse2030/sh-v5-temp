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

import { ICategory_s } from '../api/v1/Model';
import { useCategory_sStore } from '../store/Store';
import { useUpdateCategory_sMutation } from '../redux/rtk-Api';
import { baseICategory_s } from '../store/StoreConstants';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { Plus, X } from 'lucide-react';

const EditNextComponents: React.FC = () => {
  const [subItems, setSubItems] = useState<string[]>([]);
  const [currSubItem, setCurrSubItem] = useState('');
  const { toggleEditModal, isEditModalOpen, newCategory_s, selectedCategory_s, setNewCategory_s, setSelectedCategory_s } = useCategory_sStore();
  const [updateCategory_s] = useUpdateCategory_sMutation();

  useEffect(() => {
    if (selectedCategory_s) {
      setNewCategory_s(selectedCategory_s);

      const others = selectedCategory_s.subCategory || [];
      setSubItems(others);
    }
  }, [selectedCategory_s, setNewCategory_s]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory_s({ ...newCategory_s, [name]: value });
  };

  const handleEditNextComponents = async () => {
    if (!selectedCategory_s) return;

    try {
      const updateData = { ...newCategory_s, subCategory: subItems };
      await updateCategory_s({ id: selectedCategory_s._id, ...updateData }).unwrap(); // Call RTK mutation
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
  const handleSubItems = () => {
    if (currSubItem) {
      setSubItems([...subItems, currSubItem]);
      setCurrSubItem('');
    }
  };
  const handleRemoveItem = (str: string) => {
    const others = subItems.filter(i => i !== str);
    setSubItems(others);
  };
  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" name="name" value={(newCategory_s.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <div className="w-full mt-2" />
          <div className="flex flex-col items-start justify-between gap-4 p-2 ">
            {subItems.map((i, idx) => (
              <p key={i + idx} className="text-sm flex items-start justify-between gap-2 p-2 w-full bg-slate-200 dark:bg-slate-800 rounded-md">
                {i}
                <X className="size-5 cursor-pointer" onClick={() => handleRemoveItem(i)} />
              </p>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 p-2">
            <Input
              placeholder="Add Sub Item"
              id={currSubItem}
              name={currSubItem}
              type="text"
              value={currSubItem}
              onChange={e => setCurrSubItem(e.target.value)}
              className="col-span-3"
            />
            <Button size="sm" variant="outlineDefault" onClick={handleSubItems}>
              <Plus />
              Add
            </Button>
          </div>
          <div className="mt-12 pt-12" />
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              toggleEditModal(false);
              setSelectedCategory_s({ ...baseICategory_s } as ICategory_s);
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
