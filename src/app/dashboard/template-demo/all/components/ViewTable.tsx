/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import { format } from 'date-fns';
import React, { useState, useMemo } from 'react';
import { IoReloadCircleOutline } from 'react-icons/io5';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingComponent from '@/components/common/Loading';
import ErrorMessageComponent from '@/components/common/Error';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ICategory_s } from '../api/v1/Model';
import { pageLimitArr } from '../store/StoreConstants';
import { useCategory_sStore } from '../store/Store';
import { useGetCategory_sQuery } from '../redux/rtk-Api';

import Pagination from './Pagination';
import { handleSuccess } from './utils';

const ViewTableNextComponents: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ICategory_s; direction: 'asc' | 'desc' } | null>(null);
  const {
    setSelectedCategory_s,
    toggleBulkEditModal,
    toggleBulkUpdateModal,
    toggleViewModal,
    queryPramsLimit,
    toggleBulkDynamicUpdateModal,
    queryPramsPage,
    queryPramsQ,
    toggleEditModal,
    toggleDeleteModal,
    bulkData,
    setBulkData,
    setQueryPramsLimit,
    setQueryPramsPage,
    toggleBulkDeleteModal,
  } = useCategory_sStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetCategory_sQuery(
    { q: queryPramsQ, limit: queryPramsLimit, page: queryPramsPage },
    {
      selectFromResult: ({ data, isError, error, isLoading }) => ({
        data,
        isLoading,
        isError,
        error,
      }),
    },
  );

  const getAllCategory_sData = useMemo(() => getResponseData?.data?.category_s || [], [getResponseData]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

  const handleSort = (key: keyof ICategory_s) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedCategory_sData = useMemo(() => {
    if (!sortConfig) return getAllCategory_sData;
    return [...getAllCategory_sData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [getAllCategory_sData, sortConfig]);
  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? getAllCategory_sData : []);
  const handleSelectRow = (isChecked: boolean, Category_s: ICategory_s) =>
    setBulkData(isChecked ? [...bulkData, Category_s] : bulkData.filter(item => item.email !== Category_s.email));
  const handlePopUp = () => {
    handleSuccess('Reload Successful');
  };
  const renderActions = (Category_s: ICategory_s) => (
    <div className="flex gap-2">
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedCategory_s(Category_s);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4 mr-1" /> View
      </Button>
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedCategory_s(Category_s);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4 mr-1" /> Edit
      </Button>
      <Button
        variant="outlineGarden"
        size="sm"
        onClick={() => {
          setSelectedCategory_s(Category_s);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4 mr-1" /> Delete
      </Button>
    </div>
  );
  const renderTableRows = () =>
    sortedCategory_sData.map((Category_s: ICategory_s, index: number) => (
      <TableRow key={(Category_s.email as string) || index}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, Category_s)} checked={bulkData.some(item => item.email === Category_s.email)} />
        </TableCell>
        <TableCell className="font-medium">{(Category_s.name as string) || ''}</TableCell>
        <TableCell>{(Category_s.email as string) || ''}</TableCell>
        <TableCell>{(Category_s.passCode as string) || ''}</TableCell>
        <TableCell>{(Category_s.alias as string) || ''}</TableCell>
        <TableCell>
          <span className={`py-1 rounded-full text-xs font-medium bg-green-500 text-green-50 px-3`}>{(Category_s.role as string) || ''}</span>
        </TableCell>
        <TableCell>{formatDate(Category_s.createdAt)}</TableCell>
        <TableCell className="justify-end flex">{renderActions(Category_s)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error || 'An error occurred'} />;
  if (getAllCategory_sData.length === 0) return <div className="py-12 text-2xl text-slate-500">Ops! Nothing was found.</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b-1 border-slat-400">
          <div className="px-2 gap-2 flex items-center justify-start w-full">
            Total Selected <span className="text-xs text-slate-500">({bulkData.length})</span>
          </div>
          <div className="px-2 gap-2 flex items-center justify-end w-full">
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkDynamicUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B. Update
            </Button>
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkUpdateModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> B. Update
            </Button>
            <Button variant="outlineDefault" size="sm" onClick={() => toggleBulkEditModal(true)} disabled={bulkData.length === 0}>
              <PencilIcon className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button variant="outlineFire" size="sm" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-1 bg-green-100 hover:bg-green-200 border-green-300 hover:border-green-400 text-green-400 hover:text-green-500 cursor-pointer "
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
      <Table className="border-1 border-slate-500">
        <TableHeader className="bg-slate-600 text-slate-50 rounded overflow-hidden border-1 border-slate-600">
          <TableRow>
            <TableHead>
              <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === getAllCategory_sData.length} />
            </TableHead>
            {['name', 'email', 'passCode', 'alias', 'role', 'createdAt'].map(key => (
              <TableHead key={key} className={`font-bold text-slate-50 cursor-pointer`} onClick={() => handleSort(key as keyof ICategory_s)}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
            ))}
            <TableHead className="table-cell font-bold text-slate-50 text-end pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
      <Pagination
        currentPage={queryPramsPage}
        itemsPerPage={queryPramsLimit}
        onPageChange={e => setQueryPramsPage(e)}
        totalItems={getResponseData?.data?.total}
      />
      <div className="max-w-[380px] flex items-center justify-between pl-2 gap-4 border-1 border-slate-200 rounded-xl w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right text-slate-500 font-thin pl-3">
          Category_s per page
        </Label>
        <Select
          onValueChange={value => {
            setQueryPramsLimit(Number(value));
            setQueryPramsPage(1);
          }}
          defaultValue={queryPramsLimit.toString()}
        >
          <SelectTrigger className="col-span-4">
            <SelectValue placeholder="Select a limit" />
          </SelectTrigger>
          <SelectContent>
            {pageLimitArr.map(i => (
              <SelectItem
                key={i}
                value={i.toString()}
                className="focus:bg-slate-200 hover:bg-slate-300 dark:focus:bg-slate-500 dark:hover:bg-slate-600 cursor-pointer"
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
