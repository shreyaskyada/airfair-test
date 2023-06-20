/**
 * @description Service to hit external API endpoints
 * @exports AxiosInstance
 * @function requestInterceptor Endpoint for backend request
 * @function responseInterceptor Endpoint for backend response
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { store } from "../../redux/store";
import { uploadIsLoading } from "../../redux/slices/app";

const backendService: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

const responseSuccessInterceptor = (response: AxiosResponse) =>
  Promise.resolve(response.data);

const responseErrorInterceptor = (err: AxiosError) => {
  store.dispatch(uploadIsLoading(false));
  if (err.response) {
    if (err.response.status === 401) {
      // TODO: Unauthoriasd resource access by clinet, need to implement this in once error page UI is done
    }
    return Promise.reject({
      headers: err.response.headers,
      status: err.response.status,
      data: err.response.data,
      response: err.response,
    });
  }
  return Promise.reject({
    status: 500,
    data: "Something went wrong",
    response: err,
  });
};

backendService.interceptors.response.use(
  responseSuccessInterceptor,
  responseErrorInterceptor
);

export default backendService;
