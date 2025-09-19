import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import CONFIG from "../config.js";
import AuthUtils from "../utils/AuthUtils.jsx";

export const notificationApi = createApi({
    reducerPath: "notification",
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
        fetchMyNotifications: builder.query({
            query: userId => ({
                url: '/srw/notification/list',
                method: 'GET',
                params: {userId}
            })
        })
    })
});

export const { useFetchMyNotificationsQuery } = notificationApi;