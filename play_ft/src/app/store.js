import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/authentication/authSlice';
import gamesReducer from '../features/games/gameSlice';

export default configureStore({
  reducer: {
    auth: counterReducer,
    games:gamesReducer
  },
});
