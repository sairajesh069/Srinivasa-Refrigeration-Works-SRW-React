import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";

export const registerApi = createApi({
    reducerPath: "register",
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL,
        credentials: "include"
    }),
    endpoints: builder => {
        return {
            customer: builder.mutation({
                query: customerData => ({
                    url: '/srw/customer/register',
                    method: 'POST',
                    body: customerData
                })
            })
        }
    }
});

export const { useCustomerMutation } = registerApi;