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

import { ICategory_s } from '../api/v1/Model';
import { useCategory_sStore } from '../store/Store';
import { useUpdateCategory_sMutation } from '../redux/rtk-Api';
import { ISelect, category_sSelectorArr, baseICategory_s } from '../store/StoreConstants';

import DataSelect from './DataSelect';
import ImagesSelect from './ImagesSelect';
import RichTextEditor from './rich-text-editor';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

const EditNextComponents: React.FC = () => {
  const [newItemTags, setNewItemTags] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const { toggleEditModal, isEditModalOpen, newCategory_s, selectedCategory_s, setNewCategory_s, setSelectedCategory_s } = useCategory_sStore();
  const [updateCategory_s] = useUpdateCategory_sMutation();
  const [descriptions, setDescriptions] = useState('');

  const onChange = (content: string) => {
    setDescriptions(content);
  };
  useEffect(() => {
    if (selectedCategory_s) {
      setNewCategory_s(selectedCategory_s);
      setNewItemTags(selectedCategory_s.dataArr as string[]);
      setNewImages(selectedCategory_s.images as string[]);
    }
  }, [selectedCategory_s, setNewCategory_s]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory_s({ ...newCategory_s, [name]: value });
  };
  const handleRoleChange = (value: string) => {
    setNewCategory_s({ ...newCategory_s, role: value as ISelect });
  };

  const handleEditNextComponents = async () => {
    if (!selectedCategory_s) return;

    try {
      const updateData = { ...newCategory_s, dataArr: newItemTags, images: newImages };
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

  return (
    <Dialog open={isEditModalOpen} onOpenChange={toggleEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category_s</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input id="edit-name" name="name" value={(newCategory_s.name as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={(newCategory_s.email as string) || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-passCode" className="text-right">
                Pass Code
              </Label>
              <Input
                id="edit-passCode"
                name="passCode"
                type="password"
                value={(newCategory_s.passCode as string) || ''}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-alias" className="text-right">
                Alias
              </Label>
              <Input id="edit-alias" name="alias" value={(newCategory_s.alias as string) || ''} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>

              <Select onValueChange={handleRoleChange} defaultValue={(newCategory_s.role as string) || ''}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {category_sSelectorArr?.map((i, index) => (
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
