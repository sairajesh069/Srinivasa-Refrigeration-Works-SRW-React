import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const registerApi = createApi({
    reducerPath: "register",
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL,
        credentials: "include",
        prepareHeaders: (headers) => {
            const isAuthenticated = AuthUtils.isAuthenticated();
            const token = isAuthenticated ? AuthUtils.getToken() : null;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),
    endpoints: builder => {
        return {
            customer: builder.mutation({
                query: customerData => ({
                    url: '/srw/customer/register',
                    method: 'POST',
                    body: customerData
                })
            }),
            owner: builder.mutation({
                query: ownerData => ({
                    url: '/srw/owner/register',
                    method: 'POST',
                    body: ownerData
                })
            }),
            employee: builder.mutation({
                query: employeeData => ({
                    url: '/srw/employee/register',
                    method: 'POST',
                    body: employeeData
                })
            })
        }
    }
});

export const { useCustomerMutation, useOwnerMutation, useEmployeeMutation } = registerApi;