import { configureStore } from '@reduxjs/toolkit';
import { homeApi } from "./reducers/homeApi.js";

const store = configureStore({
    reducer: {
        [homeApi.reducerPath]: homeApi.reducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware()
            .concat(homeApi.middleware);
    }
});

export default store;