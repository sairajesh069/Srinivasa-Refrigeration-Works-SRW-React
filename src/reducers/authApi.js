import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../config";

export const authApi = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL,
        credentials: 'include'
    }),
    endpoints: builder => {
        return {
            login: builder.mutation({
                query: credentials => ({
                    url: '/srw/login',
                    method: "POST",
                    body: credentials
                })
            })
        }
    }
});

export const { useLoginMutation } = authApi;