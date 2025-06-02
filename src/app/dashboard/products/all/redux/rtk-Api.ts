/*
|-----------------------------------------
| setting up Controller for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: varse-project, May, 2025
|-----------------------------------------
*/
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

// Use absolute paths with leading slash to ensure consistent behavior
export const productsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/products/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeProducts', id: 'LIST' }],
    }),
    getProductsById: builder.query({
      query: id => `/dashboard/products/all/api/v1?id=${id}`,
    }),
    addProducts: builder.mutation({
      query: newProducts => ({
        url: '/dashboard/products/all/api/v1',
        method: 'POST',
        body: newProducts,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    updateProducts: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/products/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    deleteProducts: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/products/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    bulkUpdateProducts: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/products/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
    bulkDeleteProducts: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/products/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeProducts' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductsMutation,
  useUpdateProductsMutation,
  useDeleteProductsMutation,
  useBulkUpdateProductsMutation,
  useBulkDeleteProductsMutation,
  useGetProductsByIdQuery,
} = productsApi;
