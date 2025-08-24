import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const fetchProfileApi = createApi({
    reducerPath: "fetchProfile",
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL,
        credentials: 'include',
        prepareHeaders: headers => {
            if (AuthUtils.isAuthenticated()) {
                headers.set('authorization', `Bearer ${AuthUtils.getToken()}`);
            }
            return headers;
        }
    }),
    endpoints: builder => ({
        customerProfile: builder.query({
            query: customerId => ({
                url: '/srw/customer/profile',
                method: 'GET',
                params: {customerId}
            })
        }),
        ownerProfile: builder.query({
            query: ownerId => ({
                url: '/srw/owner/profile',
                method: 'GET',
                params: {ownerId}
            })
        }),
        employeeProfile: builder.query({
            query: employeeId => ({
                url: '/srw/employee/profile',
                method: 'GET',
                params: {employeeId}
            })
        })
    })
});

export const { useCustomerProfileQuery, useOwnerProfileQuery, useEmployeeProfileQuery } = fetchProfileApi;