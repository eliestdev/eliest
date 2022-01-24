import { createSlice } from '@reduxjs/toolkit';


const getToken = () => {
  const tokenString = localStorage.getItem('token');
  console.log(tokenString);

  const userToken = JSON.parse(tokenString);
  console.log(userToken);
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
    token: getToken(),
    authError: ""
  },
  reducers: {
    setAuthToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload)
    },
    removeAuthToken: (state) => {
      state.token = null;
      clearToken()
    }, setAuthError: (state, action) => {
      state.authError = action.payload
    }
  },
});

export const { setAuthToken, removeAuthToken, setAuthError } = authSlice.actions;






export const selectToken = state => state.auth.token;

export const selectAuthError = state =>{ 
  console.log(state);
  return state.auth.authError;
}

export default authSlice.reducer;
