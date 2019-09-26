import React from "react";
import { Redirect } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {}

  responseGoogle = res => {
    let data = {
      email: res.profileObj.email,
      expires_at: res.tokenObj.expires_at + res.tokenObj.expires_in
    };
    this.props.setUserInfo(data);
    localStorage.setItem("authData", JSON.stringify(res));

    let config = {
      headers: {
        access_token: JSON.parse(localStorage.getItem("authData")).Zi
          .access_token,
        "Access-Control-Allow-Origin": "*"
      },
      withCredentials: true
    };
    axios
      .post("http://localhost:8000/login/", {}, config)
      .then(res => {
        if (res.data.result) {
          this.props.history.push("/main");
        } else {
          console.log(res.data.reason);
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        console.log(err, "ERROR in login SEQ");
      });
  };
  responseFail = err => {};

  logout = () => {
    let config = {
      headers: {
        access_token: JSON.parse(localStorage.getItem("authData")).Zi
          .access_token,
        "Access-Control-Allow-Origin": "*"
      },
      withCredentials: true
    };
    axios
      .post("http://localhost:8000/logout/", {}, config)
      .then(res => {
        if (res.data.result) {
          console.log(res.data.result);
        } else {
          console.log(res.data.reason);
        }
      })
      .catch(err => {
        console.log(err, "ERROR in logout SEQ");
      });
  };

  render() {
    return (
      <div className="Login-page">
        <h1> 로그인 </h1>
        <GoogleLogin
          clientId={process.env.REACT_APP_Google}
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
        />

        <GoogleLogout
          clientId={process.env.REACT_APP_Google}
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        />
      </div>
    );
  }
}

export default Login;
