import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const userProfileApi = createApi({
    reducerPath: "userProfile",
    tagTypes: ['userProfile'],
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
                params: {customerId},
                providesTags: (result, error, customerId) => [
                    { type: "userProfile", id: `customer-${customerId}` },
                ]
            })
        }),
        ownerProfile: builder.query({
            query: ownerId => ({
                url: '/srw/owner/profile',
                method: 'GET',
                params: {ownerId},
                providesTags: (result, error, ownerId) => [
                    { type: "userProfile", id: `owner-${ownerId}` },
                ]
            })
        }),
        employeeProfile: builder.query({
            query: employeeId => ({
                url: '/srw/employee/profile',
                method: 'GET',
                params: {employeeId},
                providesTags: (result, error, employeeId) => [
                    { type: "userProfile", id: `employee-${employeeId}` },
                ]
            })
        }),
        updateCustomerProfile: builder.mutation({
            query: customerDTO => ({
                url: '/srw/customer/update-profile',
                method: 'PUT',
                body: customerDTO,
                invalidatesTags: (result, error, { customerId }) => [
                    { type: "userProfile", id: `customer-${customerId}` },
                ]
            })
        }),
        updateOwnerProfile: builder.mutation({
            query: ownerDTO => ({
                url: '/srw/owner/update-profile',
                method: 'PUT',
                body: ownerDTO,
                invalidatesTags: (result, error, { ownerId }) => [
                    { type: "userProfile", id: `owner-${ownerId}` },
                ]
            })
        }),
        updateEmployeeProfile: builder.mutation({
            query: employeeDTO => ({
                url: '/srw/employee/update-profile',
                method: 'PUT',
                body: employeeDTO,
                invalidatesTags: (result, error, { employeeId }) => [
                    { type: "userProfile", id: `employee-${employeeId}` },
                ]
            })
        })
    })
});

export const { useCustomerProfileQuery, useOwnerProfileQuery, useEmployeeProfileQuery,
    useUpdateCustomerProfileMutation, useUpdateOwnerProfileMutation, useUpdateEmployeeProfileMutation } = userProfileApi;