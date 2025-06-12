import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CONFIG from '../config';

export const homeApi = createApi({
    reducerPath: 'home',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL
    }),
    endpoints: builder => ({
        home: builder.query({
            query: () => ({
                url: '/srw/home',
                method: 'GET'
            })
        })
    })
});

export const { useHomeQuery } = homeApi;