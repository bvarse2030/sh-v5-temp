import React from 'react';
import { IProduct } from '../../products/all/api/v1/Model';

interface ProductViewDetailsProps {
  product: IProduct;
}

const KeyValueDisplay: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
  <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
      {children || (value !== undefined && value !== null && value !== '' ? value : 'N/A')}
    </dd>
  </div>
);

const HomePageView: React.FC<ProductViewDetailsProps> = ({ product }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow overflow-hidden sm:rounded-lg max-w-2xl mx-auto p-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Product Details</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-300">
          Viewing information for: <span className="font-semibold">{product.name || 'Unnamed Product'}</span>
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200 dark:sm:divide-slate-700">
          <KeyValueDisplay label="Product ID (_id)" value={product._id} />
          <KeyValueDisplay label="Name" value={product.name} />

          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</dt>
          </div>

          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Array</dt>
          </div>

          <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</dt>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default HomePageView;
