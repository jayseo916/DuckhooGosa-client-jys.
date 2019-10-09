import React from "react";
//import { formatRelative } from "date-fns";
import { axiosInstance, config } from "../config";
import "../shared/App.css";
import cats100 from "../client/img/pixel-icon-creator-24.jpg";
import { formatRelative } from "date-fns";
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBtn: false,
      inputComment: "",
      problem_id: this.props.match.params.id,
      email: this.props.history.location.state.email,
      comments: []
    };
  }

  getComments = () => {
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        console.log("처음", JSON.parse(res.data).result);
        const { totalq, totald, count, solvedUsers, nick, title } = JSON.parse(
          res.data
        );
        this.setState({
          comments: JSON.parse(res.data).result,
          totalq,
          totald,
          count,
          solvedUsers,
          nick,
          title
        });
      })
      .catch(err => {
        console.log(err);
        console.log("무엇;;");
      });
  };

  getInfo = () => {
    axiosInstance.post(`problem/${this.state.problem_id}`);
  };

  componentDidMount() {
    this.getComments();
  }
  inputCommentHandle(e) {
    this.setState({ inputComment: e.target.value });
  }
  commentBtnHandle() {
    this.setState({ commentBtn: !this.state.commentBtn });
  }

  submitComment = async () => {
    let obj = {
      _id: this.state.problem_id,
      email: this.state.email,
      evalQ: null,
      evalD: null,
      comments: this.state.inputComment
    };
    axiosInstance
      .post("/problem/evaluation", obj, config)
      .then(res => console.log(res))
      .catch(err => console.log(err));
    await axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        console.log("두번째거", JSON.parse(res.data).result);
        const { totalq, totald, count, solvedUsers, nick, title } = JSON.parse(
          res.data
        );

        this.setState({
          comments: JSON.parse(res.data).result,
          totalq,
          totald,
          count,
          solvedUsers,
          nick,
          title
        });
      })
      .catch(err => console.log(err));
    await this.setState({
      commentBtn: false,
      inputComment: ""
    });
    this.getComments();
  };
  render() {
    let list;
    const {
      comments,
      nick,
      title,
      totalq,
      totald,
      count,
      solvedUsers
    } = this.state;
    const commentBtn = this.state.commentBtn;
    // console.log(comments);
    if (comments) {
      list = comments.map((data, i) => (
        <section key={i} className="message-left flex">
          {/*IMG삽입*/}
          {data.img === null ? (
            <img
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
                marginTop: "auto"
              }}
              src={cats100}
              alt="place"
            />
          ) : (
            <img
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
                marginTop: "auto"
              }}
              src={data.img}
              alt="place"
            />
          )}

          <div
            className="nes-balloon from-left padding-zero-only"
            style={{
              paddingBottom: "1em"
            }}
          >
            <p>
              <span className="span_em_small">
                {!data.nick ? " 익명의 더쿠" : data.nick}:{" "}
              </span>
              {data.comment}
              <br />
              <span className="span_em_small grey">
                {/*{data.day}*/}
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
      <div className="pageCSS-white max-width">
        <section
          className="message-list"
          style={{
            marginTop: "2em",
            paddingBottom: "3em"
          }}
        >
          <div className="nes-container with-title is-centered padding-zero">
            <p className="title">Comments</p>
            <div>
              <p>
                {nick}가 만든 {title}
              </p>
              <p>이 문제는 현재 {solvedUsers}명이 풀었습니다</p>
              {this.state.count === 0 ? (
                <p>아직 평점이 없어요!</p>
              ) : (
                <div>
                  <p>퀄리티 평점: {(totalq / count).toFixed(2)} / 5</p>
                  <p>난이도 평점: {(totald / count).toFixed(2)} / 5</p>
                </div>
              )}
            </div>
            {commentBtn ? (
              <div
                className="trc flex"
                style={{
                  height: "4em"
                }}
              >
                <textarea
                  cols="40%"
                  rows="2"
                  onChange={e => this.inputCommentHandle(e)}
                  placeholder="의견을 남겨주세요"
                />
                <button
                  className="nes-btn"
                  onClick={() => this.submitComment()}
                >
                  UPLOAD
                </button>
                <button onClick={() => this.commentBtnHandle()}>CANCEL</button>
              </div>
            ) : (
              <div>
                <button onClick={() => this.commentBtnHandle()}>
                  <span className="span_em_middle font-2P"> 댓글입력 </span>
                </button>
              </div>
            )}
            {list ? list : <div>아직 해당문제에 대한 의견이 없습니다.</div>}
          </div>
        </section>
      </div>
    );
  }
}
