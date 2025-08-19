import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AuthUtils from "../utils/AuthUtils";
import CONFIG from "../config";

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: CONFIG.BACKEND_BASE_URL,
    credentials: 'include',
    prepareHeaders: headers => {
        if (AuthUtils.isAuthenticated()) {
            headers.set('authorization', `Bearer ${AuthUtils.getToken()}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQueryWithAuth(args, api, extraOptions);

    const errors = ["Invalid login id", "Invalid password", "Inactive user"];

    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
        const errorMessage = result.error.data?.message;

        if (!(errors.includes(errorMessage))) {
            AuthUtils.clearAuthData();
            window.location.href = "/login";
        }
    }

    return result;
};

export const authApi = createApi({
    reducerPath: "auth",
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/srw/login',
                method: "POST",
                body: credentials
            }),
            transformResponse: response => {
                if (response.token) {
                    AuthUtils.setToken(response.token);
                    AuthUtils.setUserData({
                        userId: response.userDetails.userId,
                        userType: response.userDetails.userType,
                        username: response.userDetails.firstName + " " + response.userDetails.lastName,
                        expiresIn: response.expiresIn,
                        timeStamp: response.timeStamp
                    });
                }
                return response;
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/srw/logout',
                method: "POST"
            }),
            transformResponse: response => {
                AuthUtils.clearAuthData();
                return response;
            }
        })
    })
});

export const { useLoginMutation, useLogoutMutation } = authApi;