import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import { config, axiosInstance } from "../config";
import styled from "styled-components";

let isDev = process.env.REACT_APP_LOG;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {}

  responseGoogle = async res => {
    isDev && console.log(res, "? 유적객체");
    localStorage["tokenId"] = res.tokenId;
    localStorage["email"] = res.profileObj.email;
    localStorage["access_token"] = res.Zi.access_token;
    localStorage["expires_in"] =
      Number(res.tokenObj.expires_at) + Number(res.tokenObj.expires_in);

    setInterval(() => {
      isDev && console.log("갱신검사");
      this.props.refreshStart();
      if (
        new Date(Number(localStorage.getItem("expires_in")) +(3600-60*30)*1000) >
        new Date()
      ) {
        res.reloadAuthResponse().then(authResponse => {

          isDev && console.log("_____________갱신성공_____________");
          localStorage["access_token"] = authResponse.access_token;
          localStorage["expires_in"] = authResponse.access_token;
        });
      } else {
        isDev && console.log("아직 시간 안지남");
      }
    }, 1000 * 60* 1);

    let data = {
      email: res.profileObj.email,
      expires_at: res.tokenObj.expires_at + res.tokenObj.expires_in
    };
    this.props.setUserInfo(data);
    await localStorage.setItem("authData", JSON.stringify(res));
    const config = {
      headers: {
        access_token: localStorage["authData"]
          ? JSON.parse(localStorage["authData"]).Zi.access_token
          : null,
        "Access-Control-Allow-Origin": "*"
      },
      withCredentials: true
    };

    axiosInstance
      .post("/login", {}, config)
      .then(res => {
        isDev && console.log(res, "요청결과 확인");
        if (res.data.result) {
          this.props.history.push("/main");
        } else {
          isDev && console.log(res.data.reason);
          this.props.history.push("/login");
        }
      })
      .catch(err => {
        isDev && console.log(err, "ERROR in login SEQ");
      });
  };
  responseFail = err => {
    isDev && console.log(err);
  };

  logout = () => {
    axiosInstance
      .post("/logout", {}, config)
      .then(res => {
        if (res.data.result) {
          isDev && console.log(res.data.result);
        } else {
          isDev && console.log(res.data.reason);
        }
      })
      .catch(err => {
        isDev && console.log(err, "ERROR in logout SEQ");
      });
    console.log("LOGOUT");
    this.props.emptyEmail();
    localStorage.clear();
  };

  render() {
    const BottomTextBox = styled.div`
      height: 10em;
    `;
    return (
      <div className="max-width pageCSS center-parent" id="#about">
        <div className="center-flex">
          <h1 id="about">
            <i className="snes-jp-logo brand-logo" />
            <span className="span_em_middle text-strike_white">
              {" "}
              <p>로그인</p>{" "}
            </span>
          </h1>
        </div>
        <div className="button-box">
          <GoogleLogin
            clientId={process.env.REACT_APP_Google}
            buttonText="Login"
            prompt=" consent"
            onSuccess={this.responseGoogle}
            onFailure={this.responseFail}
          />
          <span>{"  "}</span>
          <GoogleLogout
            clientId={process.env.REACT_APP_Google}
            buttonText=" Logout"
            onLogoutSuccess={this.logout}
          />
        </div>
        <BottomTextBox>
          <span>{"  "}</span>
        </BottomTextBox>
      </div>
    );
  }
}

export default Login;
