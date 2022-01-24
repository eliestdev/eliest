import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authentication/authSlice';
import utilReducer from '../features/utils/utilSlice';
import playReducer from '../features/agentplay/playslice';

export default configureStore({
  reducer: {
    auth: authReducer,
    utility: utilReducer,
    play:playReducer
  },
});
