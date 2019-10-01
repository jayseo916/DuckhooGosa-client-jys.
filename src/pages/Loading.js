import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import { Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import * as legoData from "../loading/fuckuman.json";
import * as doneData from "../loading/check.json";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: undefined
    };
  }

  componentDidMount() {
    console.log("현재 클라이언트::", process.env.REACT_APP_MODE);
    setTimeout(() => {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(json => {
          this.setState({ loading: true });

          setTimeout(() => {
            this.setState({ done: true });
          }, 1000);
        });
    }, 1200);
  }

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: legoData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    const defaultOptions2 = {
      loop: false,
      autoplay: true,
      animationData: doneData.default,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };
    return (
      <div className="App-header">
        {!this.state.done ? (
          <FadeIn>
            <div className="d-flex justify-content-center align-items-center">
              <h1>Welcome ^^</h1>
              {!this.state.loading ? (
                <Lottie options={defaultOptions} height={120} width={120} />
              ) : (
                <Lottie options={defaultOptions2} height={120} width={120} />
              )}
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
