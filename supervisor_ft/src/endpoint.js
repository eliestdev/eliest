const axios = require('axios')
const axiosInstance = axios.create();

const errorResponse = {
  status: "error",
  message: "Network Error - Service unavailable",
  data: null
}

const getToken = () => {
  const tokenString = localStorage.getItem('token');
  if (tokenString) {
    const userToken = JSON.parse(tokenString);
    return JSON.parse(userToken).access_token
  } else {
    return ""
  }
}

// Careful with get token method - over - stringified
axiosInstance.interceptors.request.use(function (config) {
  config.headers = { ...config.headers, Authorization: `Bearer ${getToken()}`, Accept: 'application/json' };
  return config;
}, function (error) {
  return Promise.reject(error);
});



const returnError = (error) => {
  if (error.response) {
    return {
      ...error.response.data,
    }
  }
  errorResponse.message = error.message
  return { ...errorResponse }
}



export const HttpGet = async (url, token) => {
  try {
    const response = await axiosInstance.get(url)
    return { ...response.data }
  } catch (error) {
    return returnError(error)
  }
};

export const HttpPost = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, { ...data })
    return { ...response.data }
  } catch (error) {
    return returnError(error)
  }
};


export const HttpPut = async (url, data, token) => {
  try {
    const response = await axiosInstance.put(url, { ...data })
    return { ...response.data }
  } catch (error) {
    return returnError(error)
  }
};
