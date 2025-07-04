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

import { IGAuthUsers } from '../api/v1/Model';
import { pageLimitArr } from '../store/StoreConstants';
import { useGAuthUsersStore } from '../store/Store';
import { useGetGAuthUsersQuery } from '../redux/rtk-Api';

import Pagination from './Pagination';
import { handleSuccess } from './utils';

const ViewTableNextComponents: React.FC = () => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof IGAuthUsers; direction: 'asc' | 'desc' } | null>(null);
  const {
    setSelectedGAuthUsers,
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
  } = useGAuthUsersStore();

  const {
    data: getResponseData,
    isLoading,
    refetch,
    isError,
    error,
  } = useGetGAuthUsersQuery(
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

  const getAllGAuthUsersData = useMemo(() => getResponseData?.data?.gAuthUsers || [], [getResponseData]);

  const formatDate = (date?: Date) => (date ? format(date, 'MMM dd, yyyy') : 'N/A');

  const handleSort = (key: keyof IGAuthUsers) => {
    setSortConfig(prev => (prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }));
  };

  const sortedGAuthUsersData = useMemo(() => {
    if (!sortConfig) return getAllGAuthUsersData;
    return [...getAllGAuthUsersData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [getAllGAuthUsersData, sortConfig]);
  const handleSelectAll = (isChecked: boolean) => setBulkData(isChecked ? getAllGAuthUsersData : []);
  const handleSelectRow = (isChecked: boolean, GAuthUsers: IGAuthUsers) =>
    setBulkData(isChecked ? [...bulkData, GAuthUsers] : bulkData.filter(item => item.email !== GAuthUsers.email));
  const handlePopUp = () => {
    handleSuccess('Reload Successful');
  };
  const renderActions = (GAuthUsers: IGAuthUsers) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedGAuthUsers(GAuthUsers);
          toggleViewModal(true);
        }}
      >
        <EyeIcon className="w-4 h-4 mr-1" /> View
      </Button>
      <Button
        className="cursor-pointer "
        variant="outlineDefault"
        size="sm"
        onClick={() => {
          setSelectedGAuthUsers(GAuthUsers);
          toggleEditModal(true);
        }}
      >
        <PencilIcon className="w-4 h-4 mr-1" /> Edit
      </Button>
      <Button
        variant="outlineFire"
        size="sm"
        onClick={() => {
          setSelectedGAuthUsers(GAuthUsers);
          toggleDeleteModal(true);
        }}
      >
        <TrashIcon className="w-4 h-4 mr-1" /> Delete
      </Button>
    </div>
  );
  const renderTableRows = () =>
    sortedGAuthUsersData.map((GAuthUsers: IGAuthUsers, index: number) => (
      <TableRow key={(GAuthUsers.email as string) || index}>
        <TableCell>
          <Checkbox onCheckedChange={checked => handleSelectRow(!!checked, GAuthUsers)} checked={bulkData.some(item => item.email === GAuthUsers.email)} />
        </TableCell>
        <TableCell className="font-medium">{(GAuthUsers.name as string) || ''}</TableCell>
        <TableCell className="">{(GAuthUsers.email as string) || ''}</TableCell>

        <TableCell className="">{GAuthUsers.userRole.join(', ')}</TableCell>
        <TableCell className="">{formatDate(GAuthUsers.createdAt)}</TableCell>
        <TableCell className="justify-end flex">{renderActions(GAuthUsers)}</TableCell>
      </TableRow>
    ));

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorMessageComponent message={error || 'An error occurred'} />;
  if (getAllGAuthUsersData.length === 0) return <div className="py-12 text-2xl ">Ops! Nothing was found.</div>;

  return (
    <div className="w-full flex flex-col">
      <div className="w-full my-4">
        <div className="w-full flex items-center justify-between gap-4 pb-2 border-b-1 border-slat-400">
          <div className="px-2 gap-2 flex items-center justify-start w-full">
            Total Selected <span className="text-xs ">({bulkData.length})</span>
          </div>
          <div className="px-2 gap-2 flex items-center justify-end w-full">
            <Button variant="outlineFire" size="sm" onClick={() => toggleBulkDeleteModal(true)} disabled={bulkData.length === 0}>
              <TrashIcon className="w-4 h-4 mr-1" /> Delete
            </Button>
            <Button
              variant="outlineGarden"
              size="sm"
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
      <Table className="border-1">
        <TableHeader className="rounded overflow-hidden border-b-1 bg-gray-200 dark:bg-gray-800">
          <TableRow>
            <TableHead>
              <Checkbox onCheckedChange={checked => handleSelectAll(!!checked)} checked={bulkData.length === getAllGAuthUsersData.length} />
            </TableHead>
            {['name', 'email', 'role', 'createdAt'].map(key => (
              <TableHead key={key} className={`font-bold  cursor-pointer`} onClick={() => handleSort(key as keyof IGAuthUsers)}>
                {key.charAt(0).toUpperCase() + key.slice(1)} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
            ))}
            <TableHead className="hidden lg:table-cell font-bold  text-end pr-4">Actions</TableHead>
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
      <div className="max-w-[380px] flex items-center justify-between pl-2 gap-4 border-1  rounded-xl w-full mx-auto mt-8">
        <Label htmlFor="set-limit" className="text-right  font-thin pl-2">
          Users per page
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
