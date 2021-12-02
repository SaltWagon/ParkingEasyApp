import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import filterReducer from './reducer';
import logger from 'redux-logger'

export const store = configureStore({
    reducer: {
        filter: filterReducer,
    },
    // middleware: [logger],
});