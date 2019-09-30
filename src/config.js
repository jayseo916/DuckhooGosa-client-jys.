export const config = {
  headers: {
    access_token: localStorage.getItem("authData")
      ? JSON.parse(localStorage.getItem("authData")).Zi.access_token
      : null,
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
};
