import React from "react";
import axios from "axios";
import { config } from "../config";
import "../shared/App.css";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem_id: this.props.match.params.problem_id,
      comments: [
        {
          comment: null,
          nick: null,
          day: null
        }
      ]
    };
  }
  componentDidMount() {
    console.log("commentjs로넘어온 props값" + JSON.stringify(this.props));
    axios
      .get(
        `${process.env.REACT_APP_SERVER}/comment/${this.state.problem_id}`,
        config
      )
      .then(res => this.setState({ comments: res }))
      .catch(err => console.log(err));
  }
  render() {
    const comments = this.state.comments;
    if (comments) {
      comments.map((data, i) => {
        return (
          <div key={i} className="nes-container is-rounded">
            <div>
              {data.nick}님의 의견:{data.comment}
            </div>
            날짜:{data.day}
          </div>
        );
      });
    } else {
      return <div>아직 해당문제에 대한 의견이 없습니다.</div>;
    }
  }
}
