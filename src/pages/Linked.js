import React, { Component } from "react";
import { config, axiosInstance } from "../config";
import { GoogleLogin } from "react-google-login";
import Img from "react-image";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";

let isDev = process.env.REACT_APP_LOG;
class Linked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      representImg: null
    };
  }
  componentDidMount = async () => {
    try {
      const { data } = await axiosInstance.get(
        `/problem/${this.props.location.problemId}`,
        config
      );
      const { title, representImg } = data;
      this.setState(() => ({
        title,
        representImg
      }));
    } catch (err) {
      console.log(err);
    }
    if (!this.props.location.problemId) {
      this.props.history.push("/main");
    }
  };

  render() {
    return this.state.title && this.state.representImg ? (
      <div className="max-width pageCSS center-parent center-flex" id="#about">
        <div className="fdc">
          <i className="snes-jp-logo brand-logo" />
          <br />
          <span className="span_em_vl text-strike_white"> 덕후고사</span>
          <br />
          <span className="span_em_small text-strike_white">
            덕후들을 위한 덕후들의 퀴즈놀이터
          </span>
        </div>

        <div
          className="filling_child"
          style={{
            outlineColor: "white",
            outlineWidth: "4px",
            outlineStyle: "solid"
          }}
        >
          <Img src={this.state.representImg} width={300} height={300} />
        </div>

        <div className="center-flex">
          <span className="span_em_default text-strike_white">
            {this.state.title}
          </span>
        </div>

        <div className="button-box">
          <Login
            setUserInfo={this.props.location.setUserInfo}
            problemId={this.props.location.problemId}
            history={this.props.history}
          />
        </div>
      </div>
    ) : null;
  }
}

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
    localStorage["expires_in"] = Number(res.tokenObj.expires_at) + Number(res.tokenObj.expires_in);

    setInterval(() => {
      isDev && console.log("갱신검사");
      this.props.refreshStart();
      if (
          new Date(Number(localStorage.getItem("expires_in")) + (3600-60*30)*1000) >
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
        console.log(res, "요청결과 확인");
        if (res.data.result) {
          this.props.history.push(`/SolvingProblem/${this.props.problemId}`);
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
    axiosInstance
      .post("/logout", {}, config)
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
    localStorage.clear();
  };

  render() {
    console.log("히스토리", this.props);
    return (
      <div className="Login-page">
        <GoogleLogin
          clientId={process.env.REACT_APP_Google}
          buttonText="문제풀러가기"
          onSuccess={this.responseGoogle}
          onFailure={this.responseFail}
          prompt=" consent"
        />
      </div>
    );
  }
}

export default Linked;
