import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const userProfileApi = createApi({
    reducerPath: "userProfile",
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
        }),
        updateCustomerProfile: builder.mutation({
            query: customerDTO => ({
                url: '/srw/customer/update-profile',
                method: 'PUT',
                body: customerDTO
            })
        }),
        updateOwnerProfile: builder.mutation({
            query: ownerDTO => ({
                url: '/srw/owner/update-profile',
                method: 'PUT',
                body: ownerDTO
            })
        }),
        updateEmployeeProfile: builder.mutation({
            query: employeeDTO => ({
                url: '/srw/employee/update-profile',
                method: 'PUT',
                body: employeeDTO
            })
        }),
        fetchUsername: builder.query({
            query: userId => ({
                url: '/srw/user/fetch-username',
                method: 'GET',
                params: {userId}
            })
        }),
        changePassword: builder.mutation({
            query: changePasswordData => ({
                url: '/srw/user/change-password',
                method: 'POST',
                body: changePasswordData
            })
        }),
        fetchAllUsersByUserType: builder.query({
            query: userType => ({
                url: `/srw/${userType}/list`,
                method: 'GET'
            })
        }),
        updateUserStatus: builder.mutation({
            query: ({updateUserStatusDTO, userType}) => ({
                url: `/srw/${userType}/update-status`,
                method: 'PUT',
                body: updateUserStatusDTO
            })
        })
    })
});

export const { useCustomerProfileQuery, useOwnerProfileQuery, useEmployeeProfileQuery,
    useUpdateCustomerProfileMutation, useUpdateOwnerProfileMutation, useUpdateEmployeeProfileMutation,
    useFetchUsernameQuery, useChangePasswordMutation,
    useFetchAllUsersByUserTypeQuery, useUpdateUserStatusMutation } = userProfileApi;