import React from "react";
//import { formatRelative } from "date-fns";
import { axiosInstance, config } from "../config";
import "../shared/App.css";
import cats100 from "../client/img/pixel-icon-creator-24.jpg";
import { formatRelative } from "date-fns";

let isDev = null
if ( process.env.REACT_APP_LOG === "TRUE"){
  isDev = true
}
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBtn: false,
      inputComment: "",
      problem_id: this.props.match.params.id,
      email: this.props.email,
      comments: []
    };
  }

  getComments = () => {
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        isDev && console.log("처음", JSON.parse(res.data).result);
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
        isDev && console.log(err);
        isDev && console.log("무엇;;");
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
    isDev && console.log(obj, "보내는 데이터 검증");
    axiosInstance
      .post("/problem/evaluation", obj, config)
      .then(res => isDev && console.log(res))
      .catch(err => isDev && console.log(err));
    await axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        isDev && console.log("두번째거", JSON.parse(res.data).result);
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
      .catch(err => isDev && console.log(err));
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
            <span className="span_em_small">
              {!data.nick ? " 익명의 더쿠" : data.nick}:{" "}
            </span>
            <span className="span_em_small">{data.comment} </span>
            <br />
            <span className="span_em_small grey">
              {/*{data.day}*/}
              {formatRelative(new Date(data.day), new Date())}
            </span>
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
            marginTop: "1em",
            paddingBottom: "3em"
          }}
        >
          <div className="nes-container nes-container-hard with-title is-centered padding-zero flex fdc">
            <p className="title font-2P">Comments</p>
            <div className="flex fdc">
              <span className="span_em_default">
                {nick}가 만든 {title}
              </span>
              <span className="span_em_default">
                이 문제는 현재 {solvedUsers}명이 풀었습니다
              </span>
              {this.state.count === 0 ? (
                <span className="span_em_default">아직 평점이 없어요!</span>
              ) : (
                <div className="flex fdc">
                  <span className="span_em_default">
                    퀄리티 평점: {(totalq / count).toFixed(2)} / 5
                  </span>
                  <span className="span_em_default">
                    난이도 평점: {(totald / count).toFixed(2)} / 5
                  </span>
                </div>
              )}
            </div>
            {commentBtn ? (
              <div
                className="trc flex filling_parent center-center-series"
                style={{}}
              >
                <textarea
                  className="flex"
                  style={{ width: "inherit" }}
                  rows="2"
                  onChange={e => this.inputCommentHandle(e)}
                  placeholder="의견을 남겨주세요"
                />
                <button
                  className="nes-btn is-primary"
                  onClick={() => this.submitComment()}
                >
                  UPLOAD
                </button>
                <button
                  className="nes-btn is-error"
                  onClick={() => this.commentBtnHandle()}
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="nes-btn"
                  onClick={() => this.commentBtnHandle()}
                >
                  <span className="span_em_middle"> 댓글입력 </span>
                </button>
                <hr className="hr-green" />
              </div>
            )}
            {list ? list : <div>아직 해당문제에 대한 의견이 없습니다.</div>}
          </div>
        </section>
      </div>
    );
  }
}
