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
        })
    })
});

export const { useComplaintRegisterMutation } = complaintApi;