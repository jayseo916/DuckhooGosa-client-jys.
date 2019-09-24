import React, { Component } from "react";
import axios from "axios";
import "../../node_modules/video-react/dist/video-react.css";
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from "video-react";
export default class SolvingProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemId: this.props.match.params.id,
      titleImg: "",
      backImg: ""
    };
  }

  loadProblem = async () => {
    const problem = await axios.get(
      `http://localhost:8000/problem/${this.state.problemId}`
    );
    this.setState({
      titleImg: problem.img,
      backImg: problem.title
    });
  };

  render() {
    return (
      <div>
        {/* <img src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/Screen+Shot+2019-09-19+at+1.26.59+PM.png" /> */}
        <Player
          playsInline
          poster="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/Screen+Shot+2019-09-19+at+1.26.59+PM.png"
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/MIKURU_LEGEND.mp4"
        />
        <Player poster="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/Screen+Shot+2019-09-19+at+1.26.59+PM.png">
          <source src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/MIKURU_LEGEND.mp4" />

          <ControlBar>
            <ReplayControl seconds={10} order={1.1} />
            <ForwardControl seconds={30} order={1.2} />
            <CurrentTimeDisplay order={4.1} />
            <TimeDivider order={4.2} />
            <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
            <VolumeMenuButton disabled />
          </ControlBar>
        </Player>
      </div>
    );
  }
}
