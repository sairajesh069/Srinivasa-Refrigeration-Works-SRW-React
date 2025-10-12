import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import CONFIG from '../config';

export const otpApi = createApi({
    reducerPath: 'otp',
    baseQuery: fetchBaseQuery({
        baseUrl: CONFIG.BACKEND_BASE_URL
    }),
    endpoints: builder => ({
        sendOtp: builder.mutation({
            query: userIdentifier => ({
                url: '/srw/otp/send',
                method: 'POST',
                body: userIdentifier
            })
        })
    })
});

export const { useSendOtpMutation } = otpApi;