import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './reducers/authApi.js';
import { homeApi } from "./reducers/homeApi.js";
import {registerApi} from "./reducers/registerApi.js";

const store = configureStore({
    reducer: {
        [homeApi.reducerPath]: homeApi.reducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware()
            .concat(homeApi.middleware)
            .concat(authApi.middleware)
            .concat(registerApi.middleware);
    }
});

export default store;