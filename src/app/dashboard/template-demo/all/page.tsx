/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BiRightArrowAlt } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import AddFilename8 from './components/Add';
import EditFilename8 from './components/Edit';
import ViewFilename8 from './components/View';
import SearchBox from './components/SearchBox';
import DeleteFilename8 from './components/Delete';
import BulkEditFilename8 from './components/BulkEdit';
import { useClotsStore } from './store/Store';
import TooManyRequests from './components/TooManyRequest';
import BulkDeleteFilename8 from './components/BulkDelete';
import { useGetClotsQuery } from './redux/rtk-Api';
import ViewClotsTable from './components/ViewTable';
import BulkUpdateClots from './components/BulkUpdate';
import BulkDynamicUpdateClots from './components/BulkDynamicUpdate';

const MainNextPage: React.FC = () => {
  const [hashSearchText, setHashSearchText] = useState('');
  const { toggleAddModal, queryPramsLimit, queryPramsPage, queryPramsQ, setQueryPramsPage, setQueryPramsQ } = useClotsStore();

  const {
    data: getResponseData,
    isSuccess,
    status: statusCode,
  } = useGetClotsQuery(
    { q: queryPramsQ, page: queryPramsPage, limit: queryPramsLimit },
    {
      selectFromResult: ({ data, isSuccess, status, error }) => ({
        data,
        isSuccess,
        status: 'status' in (error || {}) ? (error as FetchBaseQueryError).status : status, // Extract HTTP status code
        error,
      }),
    },
  );

  const handleSearch = (query: string) => {
    if (query !== hashSearchText) {
      setHashSearchText(query);
      setQueryPramsPage(1);
      setQueryPramsQ(query);
    }
  };

  const modals = [AddFilename8, ViewFilename8, BulkDeleteFilename8, BulkEditFilename8, EditFilename8, DeleteFilename8, BulkUpdateClots, BulkDynamicUpdateClots];
  const router = useRouter();

  let renderUI = (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="h2 w-full">Clot Management {isSuccess && <sup className="text-xs">(total:{getResponseData?.data?.total || '00'})</sup>}</h1>
        <div className="w-full flex flex-col md:flex-row gap-2 item-center justify-end">
          <Button size="sm" variant="outlineGarden" onClick={() => router.push('/dashboard/template-demo/ssr-view')}>
            <BiRightArrowAlt className="w-4 h-4" />
            SSR View
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => router.push('/dashboard/template-demo/client-view')}>
            <BiRightArrowAlt className="w-4 h-4" />
            Client View
          </Button>
          <Button size="sm" variant="outlineGarden" onClick={() => toggleAddModal(true)}>
            <PlusIcon className="w-4 h-4" />
            Add Clot
          </Button>
        </div>
      </div>
      <SearchBox onSearch={handleSearch} placeholder="Search here ..." autoFocus={false} />
      <ViewClotsTable />
      {modals.map((ModalComponent, index) => (
        <ModalComponent key={index} />
      ))}
    </div>
  );

  if (statusCode === 429) {
    renderUI = <TooManyRequests />;
  }

  return renderUI;
};

export default MainNextPage;
