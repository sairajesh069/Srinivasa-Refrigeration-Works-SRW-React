import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const complaintApi = createApi({
   reducerPath: "complaint",
   baseQuery: fetchBaseQuery({
       baseUrl: CONFIG.BACKEND_BASE_URL,
       credentials: "include",
       prepareHeaders: headers => {
           if (AuthUtils.isAuthenticated()) {
               headers.set('authorization', `Bearer ${AuthUtils.getToken()}`);
           }
           return headers;
       }
   }),
    endpoints: builder => ({
        complaintRegister: builder.mutation({
            query: complaintDTO => ({
                url: '/srw/complaint/register',
                method: 'POST',
                body: complaintDTO
            })
        }),
        fetchMyComplaints: builder.query({
            query: userId => ({
                url: '/srw/complaint/raised-by',
                method: 'GET',
                params: {userId}
            })
        }),
        fetchAllComplaints: builder.query({
            query: () => ({
                url: '/srw/complaint/list',
                method: 'GET'
            })
        }),
        fetchAssignedComplaints: builder.query({
            query: employeeId => ({
                url: '/srw/complaint/assigned-to',
                method: 'GET',
                params: {employeeId}
            })
        }),
        fetchComplaint: builder.query({
            query: complaintId => ({
                url: '/srw/complaint/by-id',
                method: 'GET',
                params: {complaintId}
            })
        }),
        fetchTechnicians: builder.query({
            query: context => ({
                url: '/srw/employee/active-list',
                method: 'GET',
                params: {context}
            })
        }),
        updateComplaint: builder.mutation({
            query: complaintDTO => ({
                url: '/srw/complaint/update',
                method: 'PUT',
                body: complaintDTO
            })
        })
    })
});

export const { useComplaintRegisterMutation, useFetchMyComplaintsQuery, useFetchAllComplaintsQuery, useFetchAssignedComplaintsQuery,
    useFetchComplaintQuery, useFetchTechniciansQuery, useUpdateComplaintMutation } = complaintApi;