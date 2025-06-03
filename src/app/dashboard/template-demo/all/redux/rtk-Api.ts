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
export const clotsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getClots: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/dashboard/template-demo/all/api/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeClots', id: 'LIST' }],
    }),
    getClotsById: builder.query({
      query: id => `/dashboard/template-demo/all/api/v1?id=${id}`,
    }),
    addClots: builder.mutation({
      query: newClots => ({
        url: '/dashboard/template-demo/all/api/v1',
        method: 'POST',
        body: newClots,
      }),
      invalidatesTags: [{ type: 'tagTypeClots' }],
    }),
    updateClots: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeClots' }],
    }),
    deleteClots: builder.mutation({
      query: ({ id }) => ({
        url: `/dashboard/template-demo/all/api/v1`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeClots' }],
    }),
    bulkUpdateClots: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeClots' }],
    }),
    bulkDeleteClots: builder.mutation({
      query: bulkData => ({
        url: `/dashboard/template-demo/all/api/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeClots' }],
    }),
  }),
});

export const {
  useGetClotsQuery,
  useAddClotsMutation,
  useUpdateClotsMutation,
  useDeleteClotsMutation,
  useBulkUpdateClotsMutation,
  useBulkDeleteClotsMutation,
  useGetClotsByIdQuery,
} = clotsApi;
