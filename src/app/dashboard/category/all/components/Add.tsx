/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useCategory_sStore } from '../store/Store';
import { useAddCategory_sMutation } from '../redux/rtk-Api';
import { defaultCategory_sData } from '../store/StoreConstants';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';
import { Plus, X } from 'lucide-react';

const InputField: React.FC<{
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, name, label, type = 'text', value, onChange }) => (
  <div className="grid grid-cols-4 items-center gap-4 pr-1">
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Input id={id} name={name} type={type} value={value} onChange={onChange} className="col-span-3" />
  </div>
);

const AddNextComponents: React.FC = () => {
  const [subItems, setSubItems] = useState<string[]>([]);
  const [currSubItem, setCurrSubItem] = useState('');
  const { toggleAddModal, isAddModalOpen, newCategory_s, setNewCategory_s, setCategory_s } = useCategory_sStore();
  const [addCategory_s, { isLoading }] = useAddCategory_sMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory_s({ ...newCategory_s, [name]: value });
  };
  const handleInputCancel = (value: string) => {
    const others = subItems.filter(i => i !== value);
    setSubItems(others);
    const otherNeweCategory_s = {
      ...newCategory_s,
      subCategory: others,
    };
    setNewCategory_s({ ...otherNeweCategory_s });
  };

  const handleAddCategory_s = async () => {
    const category_s = { name: newCategory_s.name, subCategory: subItems };

    try {
      const addedCategory_s = await addCategory_s(category_s).unwrap(); // Get the returned data
      setCategory_s([category_s, addedCategory_s]); // Use the returned data instead of the local `Category_s` object
      toggleAddModal(false);
      setNewCategory_s(defaultCategory_sData);
      handleSuccess('Added Successful');
    } catch (error: unknown) {
      console.log(error);
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
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <InputField id="name" name="name" label="Name" value={(newCategory_s.name as string) || ''} onChange={handleInputChange} />
          </div>

          <div className="flex flex-col items-start justify-between gap-4 p-2 ">
            {subItems.map((i, idx) => (
              <p key={i + idx} className="text-sm flex items-start justify-between gap-2 p-2 w-full bg-slate-500 dark:bg-slate-800 rounded-md">
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
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="outline"
            className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer"
            onClick={handleAddCategory_s}
          >
            Add Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
