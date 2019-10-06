import React from "react";
import { formatRelative } from "date-fns";
import { axiosInstance, config } from "../config";
import "../shared/App.css";
import cats100 from "../client/img/pixel-icon-creator-24.jpg";
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problem_id: this.props.match.params.id,
      comments: []
    };
  }
  componentDidMount() {
    // console.log(this.props);
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
    let list;
    const { comments } = this.state;
    if (comments) {
      list = comments.map((data, i) => (
        <section key={i} className="message-left flex">
          {/*IMG삽입*/}
          {data.img === null ? (
            <img
              style={{
                width: "100px",
                height: "100px",
                "object-fit": "cover",
                "border-radius": "50%",
                "margin-top": "auto"
              }}
              src={cats100}
              alt="image place"
            />
          ) : (
            <img
              style={{
                width: "100px",
                height: "100px",
                "object-fit": "cover",
                "border-radius": "50%",
                "margin-top": "auto"
              }}
              src={data.img}
              alt="image place"
            />
          )}

          <div
            className="nes-balloon from-left padding-zero-only"
            style={{
              "padding-bottom": "1em"
            }}
          >
            <p>
              <span className="span_em_small">
                {!data.nick ? " 익명의 더쿠" : data.nick}:{" "}
              </span>
              {data.comment}
              <br />
              <span className="span_em_small grey">
                {formatRelative(new Date(data.day), new Date())}
              </span>
            </p>
          </div>
        </section>
      ));
    } else {
      list = undefined;
    }
    return (
      <div className="pageCSS-green max-width">
        <section
          className="message-list"
          style={{
            marginTop: "2em",
            paddingBottom: "3em"
          }}
        >
          <div className="nes-container with-title is-centered padding-zero">
            <p className="title">Comments</p>
            {list ? list : <div>아직 해당문제에 대한 의견이 없습니다.</div>}
          </div>
        </section>
      </div>
    );
  }
}
