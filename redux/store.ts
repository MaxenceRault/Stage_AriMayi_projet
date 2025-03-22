import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Pour des hooks typés (optionnel)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
