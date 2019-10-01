import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import axios from "axios";
import { config } from "../config";

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
    console.log(`${process.env.REACT_APP_SERVER}/login`,"뭐가?")
    axios
      .post(`${process.env.REACT_APP_SERVER}/login`, {}, config)
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
  responseFail = err => {
    console.log(err);
  };

  logout = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER}logout`, {}, config)
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
    console.log("로그아웃");
    this.props.emptyEmail();
    localStorage.removeItem("authData");
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
