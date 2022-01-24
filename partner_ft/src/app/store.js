import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/authentication/authSlice';

export default configureStore({
  reducer: {
    auth: counterReducer,
  },
});
