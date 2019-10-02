import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { Redirect } from "react-router-dom";
import * as legoData from "../loading/8092-retro-console-run";
import * as doneData from "../loading/5785-checkmark.json";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      done: undefined
    };
  }

  componentDidMount() {
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
      <div className="App-header">
        {!this.state.done ? (
          <FadeIn>
            <div className="d-flex justify-content-center align-items-center load-page">
              <p>
                <h1> 덕후고사.app </h1>
              </p>
              {!this.state.loading ? (
                <Lottie options={defaultOptions} height={240} width={240} />
              ) : (
                <Lottie options={defaultOptions2} height={240} width={240} />
              )}
              <h2> studio TheKOO </h2>
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
