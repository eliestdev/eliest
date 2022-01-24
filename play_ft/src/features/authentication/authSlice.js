import { createSlice } from '@reduxjs/toolkit';
import API from 'endpoint';


const getToken = () => {
  const tokenString = localStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken
};

const saveToken = userToken => {
  if (userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
  }
};

const clearToken = () => {
  localStorage.removeItem('token');
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    authError: "",
    profile: {},
    loading: false,
    fundModal: false,
    fundResponse: ""
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, data) => {
      state.profile = data.payload;
    },
    removeAuthToken: (state) => {
      state.token = null;
      clearToken()
    },
    setAuthError: (state, action) => {
      state.authError = action.payload
    }, toggleFundModal: (state, action) => {
      state.fundModal = !state.fundModal
    }, setFundResponse: (state, { payload }) => {
      state.fundResponse = payload
    }, setFundLoading: (state, flag) => {
      state.loading = flag.payload
    },
  },
});

export const { setAuthToken, setProfile, removeAuthToken, setAuthError, toggleFundModal, setFundResponse, setFundLoading } = authSlice.actions;



export const selectToken = state => state.auth.token;

export const selectAuthError = state => {
  console.log(state);
  return state.auth.authError;
}

export default authSlice.reducer;
