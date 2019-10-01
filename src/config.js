export const config = {
  headers: {
    access_token: localStorage["authData"]
      ? JSON.parse(localStorage["authData"]).Zi.access_token
      : null,
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
};
