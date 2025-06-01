import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more reducers as needed
  },
  devTools: import.meta.env.DEV,
});

export default store;
