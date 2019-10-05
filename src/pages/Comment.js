import React from "react";
// import axiosInstance from "axios";
import { axiosInstance, config } from "../config";
import "../shared/App.css";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem_id: this.props.match.params.id,
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
    // console.log("scoring에서 넘어온 props값:" + JSON.stringify(this.props));
    // let temp;
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        // console.log("응답 response값:" + res.data);
        this.setState({ comments: JSON.parse(res.data) });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { comments } = this.state;
    console.log(comments);
    if (comments[0].comment !== null) {
      comments.map((data, i) => {
        return (
          <div key={i} className="nes-container is-rounded">
            <div>
              {data.nick}님의 의견:
              <div style={{ fontSize: "20px" }}>{data.comment}</div>
            </div>
            날짜:{data.day}
          </div>
        );
      });
    } else {
      return <div>아직 해당문제에 대한 의견이 없습니다.</div>;
    }
    // return comments.map((data, i) => (
    //   <div key={i} className="nes-container is-rounded">
    //     <div>
    //       {data.nick}님의 의견:
    //       <div style={{ fontSize: "20px" }}>{data.comment}</div>
    //     </div>
    //     날짜:{data.day}
    //     <hr></hr>
    //   </div>
    // ));
    // return <div>ddd</div>;
  }
}
