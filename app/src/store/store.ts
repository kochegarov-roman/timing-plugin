import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { commonAPI } from "./common.api.v1.ts";

const rootReducer = combineReducers({
  [commonAPI.reducerPath]: commonAPI.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(commonAPI.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export default store;
