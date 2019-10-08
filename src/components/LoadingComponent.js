import React, { Component } from "react";
import "../../node_modules/nes.css/css/nes.css";

class LoadingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 1
    };
  }

  componentDidMount() {
    this.startRendering();
  }

  startRendering = () => {
    setInterval(() => {
      let nextValue = undefined;
      if (this.state.progress === 100) {
        nextValue = 0;
      } else {
        nextValue = this.state.progress + Math.floor(Math.random() * 25);
        if (nextValue > 100) {
          nextValue = 100;
        }
      }
      this.setState({ progress: nextValue });
    }, 50);
  };

  render() {
    return (
      <div className="filling_parent flex">
        <progress
          className="flex margin-center-vertical nes-progress is-success center-item"
          value={this.state.progress}
          max="100"
        />
      </div>
    );
  }
}

export default LoadingComponent;
