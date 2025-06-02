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
export const category_sApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategory_s: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/template-demo/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCategory', id: 'LIST' }],
    }),
    getCategory_sById: builder.query({
      query: id => `/dashboard/template-demo/all/api/v1?id=${id}`,
    }),
    addCategory_s: builder.mutation({
      query: newCategory_s => ({
        url: '/dashboard/template-demo/all/api/v1',
        method: 'POST',
        body: newCategory_s,
      }),
      invalidatesTags: [{ type: 'tagTypeCategory' }],
    }),
    updateCategory_s: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCategory' }],
    }),
    deleteCategory_s: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCategory' }],
    }),
    bulkUpdateCategory_s: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCategory' }],
    }),
    bulkDeleteCategory_s: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCategory' }],
    }),
  }),
});

export const {
  useGetCategory_sQuery,
  useAddCategory_sMutation,
  useUpdateCategory_sMutation,
  useDeleteCategory_sMutation,
  useBulkUpdateCategory_sMutation,
  useBulkDeleteCategory_sMutation,
  useGetCategory_sByIdQuery,
} = category_sApi;
