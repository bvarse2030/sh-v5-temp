'use client';

import { format } from 'date-fns';
import React, { useState, useMemo, useEffect } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { IProduct } from '../api/v1/Model';
import { pageLimitArr } from '../store/StoreConstants';
import { useProductsStore } from '../store/Store';
import { useGetProductsQuery } from '../redux/rtk-Api';

import Pagination from './Pagination';
import { handleSuccess } from './utils';

const getStatusColor = (status: IProduct['productStatus']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 text-green-50';
    case 'out-of-stock':
      return 'bg-yellow-500 text-yellow-50';
    case 'disabled':
      return 'bg-red-500 text-red-50';
    case 'coming-soon':
      return 'bg-blue-500 text-blue-50';
    default:
      return 'bg-gray-500 text-gray-50';
  }
};

const ViewTableNextComponents: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof IProduct; direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });
  const {
    setSelectedProducts,
    toggleBulkEditModal,
    toggleBulkUpdateModal,
    toggleViewModal,
    queryPramsLimit,
    queryPramsPage,
    queryPramsQ,
    toggleEditModal,
    toggleDeleteModal,
    bulkData,
    setBulkData,
    setQueryPramsLimit,
    setQueryPramsPage,
    toggleBulkDeleteModal,
  } = useProductsStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetProductsQuery(
    {
      q: queryPramsQ,
      limit: queryPramsLimit,
      page: queryPramsPage,
    },
    {
      selectFromResult: ({ data, isError, error, isLoading }) => ({
        data,
        isLoading,
        isError,
        error,
      }),
    },
  );

  const allProductsData = useMemo(() => getResponseData?.data?.products || [], [getResponseData]);

  const formatDate = (date?: Date | string) => (date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A');

  const handleSort = (key: keyof IProduct) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProductsData = useMemo(() => {
    if (!sortConfig) return allProductsData;
    return [...allProductsData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allProductsData, sortConfig]);

  const handleSelectAll = (isChecked: boolean) => {
    setBulkData(isChecked ? sortedProductsData.map((p: IProduct) => p._id.toString()) : []);
  };

  const handleSelectRow = (isChecked: boolean, product: IProduct) => {
    setBulkData(isChecked ? [...bulkData, product] : bulkData.filter(p => p._id !== product._id));
  };

  const handlePopUp = () => {
    handleSuccess('Data reloaded successfully');
  };

  const renderActions = (product: IProduct) => (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedProducts(product);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4 mr-1" /> View
      </Button>
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedProducts(product);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4 mr-1" /> Edit
      </Button>
      <Button
        variant="outlineFire"
        size="sm"
        onClick={() => {
          setSelectedProducts(product);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4 mr-1" /> Delete
      </Button>
    </div>
  );

  const tableHeaders: { key: keyof IProduct; label: string; sortable?: boolean }[] = [
    { key: 'productUID', label: 'UID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'realPrice', label: 'Price', sortable: true },
    { key: 'productStatus', label: 'Status', sortable: true },
    { key: 'totalSells', label: 'Sells', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true },
  ];

  const renderTableRows = () =>
    sortedProductsData.map((product: IProduct) => (
      <TableRow key={product._id.toString()}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, product)} checked={bulkData.includes(product)} />
        </TableCell>
        <TableCell className="font-medium truncate max-w-[100px]">{product.productUID}</TableCell>
        <TableCell className="truncate max-w-[150px]">{product.name}</TableCell>
        <TableCell className="truncate max-w-[100px]">{product.category}</TableCell>
        <TableCell>${product.realPrice?.toFixed(2)}</TableCell>
        <TableCell>
          <span className={`py-1 px-3 rounded-full text-xs font-medium ${getStatusColor(product.productStatus)}`}>
            {product.productStatus?.replace('-', ' ')}
          </span>
        </TableCell>
        <TableCell>{product.totalSells || 0}</TableCell>
        <TableCell>{formatDate(product.createdAt)}</TableCell>
        <TableCell className="text-right">{renderActions(product)}</TableCell>
      </TableRow>
    ));

  useEffect(() => {
    if (getResponseData?.data?.total === 0) {
      setBulkData([]);
    }
  }, [getResponseData, setBulkData]);

  if (isLoading) return <LoadingComponent />;
  if (isError && error) {
    const errorMessage =
      typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
        ? (error.data as any).message
        : 'An error occurred fetching products.';
    return <ErrorMessageComponent message={errorMessage} />;
  }
  if (!isLoading && allProductsData.length === 0 && queryPramsQ) {
    return <div className="py-12 text-center text-xl text-slate-500">No products found for your search: "{queryPramsQ}".</div>;
  }
  if (!isLoading && allProductsData.length === 0) {
    return <div className="py-12 text-center text-xl text-slate-500">No products available. Add some!</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-300 dark:border-slate-700">
          <div className="px-2 gap-2 flex items-center justify-start w-full md:w-auto">
            Total Selected <span className="text-xs text-slate-500">({bulkData.length})</span>
          </div>
          <div className="px-2 gap-2 flex flex-wrap items-center justify-end w-full md:w-auto">
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> Bulk Update
            </Button>
            <Button variant="outlineFire" size="sm" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> Bulk Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 hover:border-green-400 text-green-500 hover:text-green-600 dark:border-green-700 dark:hover:border-green-600 dark:text-green-400 dark:hover:text-green-300"
              onClick={() => {
                refetch();
                handlePopUp();
              }}
              disabled={isLoading}
            >
              <IoReloadCircleOutline className="w-4 h-4 mr-1" /> Reload
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-slate-300 dark:border-slate-700">
          <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={checked => handleSelectAll(!!checked)}
                  checked={bulkData.length > 0 && bulkData.length === sortedProductsData.length}
                  disabled={sortedProductsData.length === 0}
                />
              </TableHead>
              {tableHeaders.map(header => (
                <TableHead
                  key={header.key}
                  className={`font-semibold cursor-pointer ${!header.sortable ? 'cursor-default' : ''}`}
                  onClick={() => header.sortable && handleSort(header.key as keyof IProduct)}
                >
                  {header.label} {sortConfig?.key === header.key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
              ))}
              <TableHead className="font-semibold text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={e => setQueryPramsPage(e)}
        totalItems={getResponseData?.data?.total || 0}
      />
      <div className="max-w-[300px] flex items-center justify-between pl-2 gap-4 border border-slate-300 dark:border-slate-700 rounded-lg w-full mx-auto mt-8 p-2">
        <Label htmlFor="set-limit" className="text-right text-sm text-slate-600 dark:text-slate-400">
          Items per page:
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem
                key={i}
                value={i.toString()}
                className="focus:bg-slate-200 hover:bg-slate-300 dark:focus:bg-slate-700 dark:hover:bg-slate-600 cursor-pointer"
              >
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ViewTableNextComponents;
