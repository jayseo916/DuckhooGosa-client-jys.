import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { Redirect } from "react-router-dom";
import * as legoData from "../loading/8092-retro-console-run";
import * as doneData from "../loading/5785-checkmark.json";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import { axiosInstance, config } from "../config";
class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      done: undefined
    };
  }

  componentDidMount() {
    axiosInstance
      .get("/", {}, config)
      .then(res => {
        console.log(res, "Server Status GOOD");
      })
      .catch(err => {
        console.log(err, "Server Status BAD");
      });

    console.log("현재 클라이언트::", process.env.REACT_APP_MODE);
    setTimeout(() => {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.setState({ done: true });
        }, 800);
      });
    }, 2000);
  }

  render() {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: doneData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    const defaultOptions2 = {
      loop: true,
      autoplay: true,
      animationData: legoData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    return (
      <div className="pageCSS-pink max-width center-parent">
        {!this.state.done ? (
          <FadeIn className="margin-center-vertical flex">
            <div className="load-page flex ">
              <p>
                <span className="span_em_vl text-strike_white">
                  {" "}
                  덕후고사.app
                </span>
              </p>
              {!this.state.loading ? (
                <Lottie options={defaultOptions} height={240} width={240} />
              ) : (
                <Lottie options={defaultOptions2} height={240} width={240} />
              )}
              <span className="span_em_l text-strike_white">TheKOO.studio</span>
            </div>
          </FadeIn>
        ) : (
          <div>
            <h1>DuckhooGosad</h1>
            <Redirect to="/login" />
          </div>
        )}
      </div>
    );
  }
}
export default Loading;
