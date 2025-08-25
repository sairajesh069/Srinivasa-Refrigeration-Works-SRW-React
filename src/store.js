import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './reducers/authApi.js';
import { homeApi } from "./reducers/homeApi.js";
import {registerApi} from "./reducers/registerApi.js";
import {accountRecoveryApi} from "./reducers/accountRecoveryApi.js";
import {userProfileApi} from "./reducers/userProfileApi.js";

const store = configureStore({
    reducer: {
        [homeApi.reducerPath]: homeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        [accountRecoveryApi.reducerPath]: accountRecoveryApi.reducer,
        [userProfileApi.reducerPath]: userProfileApi.reducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE'
                ]
            }
        })
            .concat(homeApi.middleware)
            .concat(authApi.middleware)
            .concat(registerApi.middleware)
            .concat(accountRecoveryApi.middleware)
            .concat(userProfileApi.middleware);
    }
});

export default store;