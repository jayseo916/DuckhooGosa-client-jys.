import { GoogleLogin } from "react-google-login";
import React from "react";

let axios = require("axios");
let isDev = process.env.REACT_APP_LOG;

export const config = {
  headers: {
    access_token: localStorage["authData"]
      ? JSON.parse(localStorage["authData"]).Zi.access_token
      : null,
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
};

isDev && console.log(process.env.REACT_APP_SERVER, "여기로 설정");
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER
  /* other custom settings */
});

export const checkAuth = () => {

};
