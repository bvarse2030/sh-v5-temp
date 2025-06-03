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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useClotsStore } from '../store/Store';
import { useAddClotsMutation } from '../redux/rtk-Api';
import { defaultClotsData, select, ISelect, clotsSelectorArr } from '../store/StoreConstants';

import DataSelect from './DataSelect';
import ImagesSelect from './ImagesSelect';
import RichTextEditor from './rich-text-editor';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

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
  const { toggleAddModal, isAddModalOpen, newClots, setNewClots, setClots } = useClotsStore();
  const [addClots, { isLoading }] = useAddClotsMutation();

  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  const [descriptions, setDescriptions] = useState('');

  const onChange = (content: string) => {
    setDescriptions(content);
    console.log(content);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClots({ ...newClots, [name]: value });
  };

  const handleRoleChange = (value: string) => {
    setNewClots({ ...newClots, role: value as ISelect });
  };

  const handleAddClots = async () => {
    const clots = {
      dataArr: newItemTags || [],
      name: newClots.name || '',
      email: newClots.email || '',
      passCode: newClots.passCode || '',
      alias: newClots.alias || '',
      role: (newClots.role as ISelect) || select,
      images: newImages || [],
      descriptions: descriptions || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const addedClots = await addClots(clots).unwrap(); // Get the returned data
      setClots([clots, addedClots]); // Use the returned data instead of the local `Clots` object
      toggleAddModal(false);
      setNewClots(defaultClotsData);
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

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Clots</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <InputField id="name" name="name" label="Name" value={(newClots.name as string) || ''} onChange={handleInputChange} />
            <InputField id="email" name="email" label="Email" type="email" value={(newClots.email as string) || ''} onChange={handleInputChange} />
            <InputField
              id="passCode"
              name="passCode"
              label="Pass Code"
              type="password"
              value={(newClots.passCode as string) || ''}
              onChange={handleInputChange}
            />
            <InputField id="alias" name="alias" label="Alias" value={(newClots.alias as string) || ''} onChange={handleInputChange} />
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={handleRoleChange} defaultValue={(newClots.role as string) || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {clotsSelectorArr?.map((i, index) => (
                    <SelectItem key={i + index} className="cursor-pointer" value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DataSelect newItemTags={newItemTags as string[]} setNewItemTags={setNewItemTags} />
            <ImagesSelect newImages={newImages as string[]} setNewImages={setNewImages} />

            <RichTextEditor content={descriptions} onChange={onChange} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="outline" className="border-slate-500 hover:border-slate-600 border-1 cursor-pointer" onClick={handleAddClots}>
            Add Clots
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNextComponents;
