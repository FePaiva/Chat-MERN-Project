// configureStore to holds the reducers and state
import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import appApi from './services/appApi';

//  to persist our store (so user do not have to login everytime the page is reloaded)
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

// reducers
const reducer = combineReducers({
    user: userSlice,
    [appApi.reducerPath] : appApi.reducer
});

const persistConfig = {
    key: 'root',
    storage,
    // to not persist the reducers
    blackList: [appApi.reducerPath],
};

// to persist the store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store
const store = configureStore({
    reducer: persistedReducer,
    // to make asynchronous requests
    middleware: [thunk, appApi.middleware],
});

export default store;

