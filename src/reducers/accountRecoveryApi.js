import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from '../config';

export const accountRecoveryApi = createApi({
    reducerPath: 'accountRecovery',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL
    }),
    endpoints: builder => {
        return {
            usernameRecovery: builder.mutation({
                query: usernameRecoveryData => ({
                    url: '/srw/forgot-username',
                    method: 'POST',
                    body: usernameRecoveryData
                })
            }),
            userValidation: builder.mutation({
                query: userValidationData => ({
                    url: '/srw/validate-user',
                    method: 'POST',
                    body: userValidationData
                })
            }),
            passwordReset: builder.mutation({
                query: passwordResetData => ({
                    url: '/srw/forgot-password',
                    method: 'POST',
                    body: passwordResetData
                })
            })
        }
    }
});

export const { useUsernameRecoveryMutation, useUserValidationMutation, usePasswordResetMutation } = accountRecoveryApi;