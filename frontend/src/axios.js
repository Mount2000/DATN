import axios from "axios";
import { apiRefreshToken } from "./apis/auth";

let request
const instance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  // let localStorageData = window.localStorage.getItem('persist:shop/user');
  // if (localStorageData && typeof localStorageData === 'string') {
  //   localStorageData = JSON.parse(localStorageData);
  //   const token = JSON.parse(localStorageData?.token);
  //   config.headers = { authorization: `Bearer ${token}` };
  //   return config
  // } else return config
  request = config
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // console.log("axios success:",this)
  return response.data;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  const message = error.message
  if(message == "jwt expired"){
    const response = await apiRefreshToken();
    const accessToken = response.metaData.accessToken
    const newRequest = () => instance({
      url: request.url,
      method: request.method,
      data: request.data,
  });
  await newRequest()
  }
  console.log("error:", error)
  return error;
});

export default instance;