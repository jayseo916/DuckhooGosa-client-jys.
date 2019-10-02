let axios = require("axios");

export const config = {
  headers: {
    access_token: localStorage["authData"]
      ? JSON.parse(localStorage["authData"]).Zi.access_token
      : null,
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
};

console.log(process.env.REACT_APP_SERVER, "여기로 설정");
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER
  /* other custom settings */
});
