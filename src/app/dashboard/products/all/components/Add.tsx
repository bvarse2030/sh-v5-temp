import React, { useState, useCallback, useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useProductsStore } from '../store/Store';
import { useAddProductsMutation } from '../redux/rtk-Api';
import { defaultProductsData, productStatusOptions, defaultProductStatus } from '../store/StoreConstants';
import type { IProduct } from '../api/v1/Model';

import RichTextEditor from './rich-text-editor';
import { formatDuplicateKeyError, handleError, handleSuccess, isApiErrorResponse } from './utils';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  min?: number;
}

const InputField: React.FC<InputFieldProps> = ({ id, name, label, type = 'text', value, onChange, className, placeholder, min }) => (
  <div className={`grid grid-cols-4 items-center gap-4 pr-1 ${className}`}>
    <Label htmlFor={id} className="text-right">
      {label}
    </Label>
    <Input id={id} name={name} type={type} value={value} onChange={onChange} className="col-span-3" placeholder={placeholder} min={min} />
  </div>
);

const AddProductModal: React.FC = () => {
  const { toggleAddModal, isAddModalOpen } = useProductsStore();
  const [addProductMutation, { isLoading }] = useAddProductsMutation();
  const [formData, setFormData] = useState<IProduct>(defaultProductsData);

  useEffect(() => {
    if (isAddModalOpen) {
      setFormData(defaultProductsData);
    }
  }, [isAddModalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      if (name.startsWith('image.')) {
        const imageField = name.split('.')[1] as keyof IProduct['image'];
        return {
          ...prev,
          image: {
            ...prev.image,
            [imageField]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value,
      };
    });
  };

  const handleDescriptionChange = useCallback((content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  }, []);

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, productStatus: value as IProduct['productStatus'] }));
  };

  const handleAddProduct = async () => {
    const productPayload: Partial<IProduct> = {
      ...formData,
      realPrice: Number(formData.realPrice),
      discountPrice: Number(formData.discountPrice),
      totalSells: Number(formData.totalSells || 0),
    };

    try {
      await addProductMutation(productPayload).unwrap();
      toggleAddModal(false);
      handleSuccess('Product added successfully');
    } catch (error: unknown) {
      console.error('Failed to add product:', error);
      let errMessage: string = 'An unknown error occurred.';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || error.data.message || 'API error response';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      handleError(errMessage);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={toggleAddModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] w-full rounded-md p-1 pr-4">
          <div className="grid gap-4 py-4">
            <InputField
              id="productUID"
              name="productUID"
              label="Product UID"
              value={formData.productUID}
              onChange={handleInputChange}
              placeholder="Unique Product ID"
            />
            <InputField id="name" name="name" label="Name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" />

            <div className="grid grid-cols-4 items-start gap-4 pr-1">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <div className="col-span-3">
                <RichTextEditor content={formData.description} onChange={handleDescriptionChange} />
              </div>
            </div>

            <InputField
              id="imageFor"
              name="image.imageFor"
              label="Image For"
              value={formData.image.imageFor}
              onChange={handleInputChange}
              placeholder="e.g., main_display, thumbnail"
            />
            <InputField
              id="imgURL"
              name="image.imgURL"
              label="Image URL"
              type="url"
              value={formData.image.imgURL}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
            />

            <InputField
              id="realPrice"
              name="realPrice"
              label="Real Price"
              type="number"
              value={formData.realPrice}
              onChange={handleInputChange}
              placeholder="0.00"
              min={0}
            />
            <InputField
              id="discountPrice"
              name="discountPrice"
              label="Discount Price"
              type="number"
              value={formData.discountPrice}
              onChange={handleInputChange}
              placeholder="0.00"
              min={0}
            />

            <InputField
              id="color"
              name="color"
              label="Color (Optional)"
              value={formData.color || ''}
              onChange={handleInputChange}
              placeholder="e.g., Red, Blue"
            />
            <InputField
              id="category"
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Electronics, Clothing"
            />

            <div className="grid grid-cols-4 items-center gap-4 pr-1">
              <Label htmlFor="productStatus" className="text-right">
                Status
              </Label>
              <Select onValueChange={handleStatusChange} value={formData.productStatus || defaultProductStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {productStatusOptions.map(status => (
                    <SelectItem key={status} value={status} className="cursor-pointer">
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputField
              id="totalSells"
              name="totalSells"
              label="Total Sells (Optional)"
              type="number"
              value={formData.totalSells || 0}
              onChange={handleInputChange}
              placeholder="0"
              min={0}
            />
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" className="border-slate-400 hover:border-slate-600" onClick={() => toggleAddModal(false)}>
            Cancel
          </Button>
          <Button disabled={isLoading} variant="default" className="bg-slate-700 hover:bg-slate-800 text-white" onClick={handleAddProduct}>
            {isLoading ? 'Adding...' : 'Add Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
