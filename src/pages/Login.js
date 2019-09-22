import React from "react";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {
  }

  responseGoogle = res => {
    let data = {
      email: res.profileObj.email,
      expires_at: res.tokenObj.expires_at+ res.tokenObj.expires_in
    };
    this.props.setUserInfo(data);
    localStorage.setItem("loginToken", JSON.stringify(res));
    this.props.history.push("/main");
  };
  responseFail = err => {
  };

  render() {
    return (
        <div className="Login-page">
          <h1> 로그인 </h1>
          <GoogleLogin
              clientId={process.env.REACT_APP_Google}
              buttonText="Google"
              onSuccess={this.responseGoogle}
              onFailure={this.responseFail}
          />
        </div>
    );
  }
}

export default Login;
