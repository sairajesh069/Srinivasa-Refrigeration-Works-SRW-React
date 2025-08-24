import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './reducers/authApi.js';
import { homeApi } from "./reducers/homeApi.js";
import {registerApi} from "./reducers/registerApi.js";
import {accountRecoveryApi} from "./reducers/accountRecoveryApi.js";
import {fetchProfileApi} from "./reducers/fetchProfileApi.js";

const store = configureStore({
    reducer: {
        [homeApi.reducerPath]: homeApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [registerApi.reducerPath]: registerApi.reducer,
        [accountRecoveryApi.reducerPath]: accountRecoveryApi.reducer,
        [fetchProfileApi.reducerPath]: fetchProfileApi.reducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE'
                ],
            },
        })
            .concat(homeApi.middleware)
            .concat(authApi.middleware)
            .concat(registerApi.middleware)
            .concat(accountRecoveryApi.middleware)
            .concat(fetchProfileApi.middleware);
    }
});

export default store;