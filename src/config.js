export const config = {
  headers: {
    access_token: JSON.parse(localStorage.getItem("authData")).Zi.access_token,
    "Access-Control-Allow-Origin": "*"
  },
  withCredentials: true
};