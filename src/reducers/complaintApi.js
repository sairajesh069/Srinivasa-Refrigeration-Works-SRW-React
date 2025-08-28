import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const complaintApi = createApi({
   reducerPath: "complaint",
    tagTypes: ["complaints"],
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
            }),
            invalidatesTags: ["complaints"]
        }),
        fetchMyComplaints: builder.query({
            query: userId => ({
                url: '/srw/complaint/raised-by',
                method: 'GET',
                params: {userId}
            }),
            providesTags: (result, error, userId) => [
                { type: "complaints", id: `raised-by-${userId}` },
            ]
        }),
        fetchAllComplaints: builder.query({
            query: () => ({
                url: '/srw/complaint/list',
                method: 'GET'
            }),
            providesTags: (result, error) => [
                { type: "complaints", id: `list` },
            ]
        }),
        fetchAssignedComplaints: builder.query({
            query: employeeId => ({
                url: '/srw/complaint/assigned-to',
                method: 'GET',
                params: {employeeId}
            }),
            providesTags: (result, error, employeeId) => [
                { type: "complaints", id: `assigned-to-${employeeId}` },
            ]
        })
    })
});

export const { useComplaintRegisterMutation, useFetchMyComplaintsQuery,
    useFetchAllComplaintsQuery, useFetchAssignedComplaintsQuery } = complaintApi;