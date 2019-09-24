import React, { Component } from "react";
import axios from "axios";
import "../../node_modules/video-react/dist/video-react.css";
import problems from "./fake";
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
      backImg: "",
      problems: problems
    };
  }

  componentDidMount() {
    // this.loadProblem();
  }

  loadProblem = async () => {
    try {
      const problem = await axios.get(
        `http://localhost:8000/problem/${this.state.problemId}`
      );
      this.setState({
        titleImg: problem.img,
        backImg: problem.title,
        problems: problem.problems
      });
    } catch (ex) {
      console.error(ex);
    }
  };
  viewProblem = () => {
    const { problems } = this.state.problems;
    let view = problems.map((problem, num) => {
      return (
        <div key={num}>
          <label>{num + 1}번.</label>
          <Player>
            <source src={`${problem.filLink1}`} />
            <ControlBar>
              <ReplayControl seconds={10} order={1.1} />
              <ForwardControl seconds={30} order={1.2} />
              <CurrentTimeDisplay order={4.1} />
              <TimeDivider order={4.2} />
              <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
              <VolumeMenuButton disabled />
            </ControlBar>
          </Player>
          <p>{problem.problemText}</p>
        </div>
      );
    });

    return view;
  };

  render() {
    return <div>{this.viewProblem()}</div>;
  }
}
