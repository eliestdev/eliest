import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_ENDPOINT_URL,
  headers: { "Access-Control-Allow-Origin":"*" }
});