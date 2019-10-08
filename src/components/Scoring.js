import React, { Component } from "react";
import "../../node_modules/nes.css/css/nes.css";
import { Modal } from "antd";
import { axiosInstance, config } from "../config";
import StarRatingComponent from "react-star-rating-component";
import "../shared/App.css";
import styled from "styled-components";
const isDev = process.env.REACT_APP_LOG;

export class Scoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      evalQ: 3,
      evalD: 3,
      comment: "",
      email: this.props.data.email,
      visible2: false,
      nickname: ""
    };
    this.id = 0;
    this.CommentBOX = styled.div`
      vertical-align: center;
    `;
  }

  componentDidMount() {
    this.id = setInterval(() => {
      let el = document.getElementsByClassName(
        "pageCSS-white container center-parent"
      )[0];
      isDev && console.log(el, "어디보자!");
      if (el !== undefined) {
        el.style.backgroundColor = "#72B332";
      }
      let element = document.querySelectorAll(".ant-btn");
      if (element.length > 0) {
        element[0].className = "nes-btn is-primary ";
        element[1].className = "nes-btn is-success ";
        clearInterval(this.id);
      }
    }, 100);
    axiosInstance
      .get("/account/info", config)
      .then(res => this.setState({ nickname: res.data.nickname }))
      .catch(err => isDev && console.log(err));
  }

  goComment = () => {
    this.props.history.push({
      pathname: `/comment/${this.props.data.problem_id}`,
      state: { email: this.state.email }
    });
  };
  evalSubmit() {
    this.setState({ visible: false });
    axiosInstance
      .post(
        "/problem/evaluation",
        {
          _id: this.props.data.problem_id,
          evalQ: this.state.evalQ,
          evalD: this.state.evalD,
          comments: this.state.comment,
          email: this.state.email
        },
        config
      )
      .then(res => isDev && console.log(res))
      .catch(err => isDev && console.log(err));
  }
  cancel = e => {
    this.setState({ visible: false });
  };
  setEvalQ(e) {
    this.setState({
      evalQ: e
    });
  }
  setEvalD(e) {
    this.setState({
      evalD: e
    });
  }
  commentHandle = e => {
    this.setState({ comment: e.target.value });
  };
  viewScoring = checkProblem => {
    //문제 오브젝트어레이 넣으면 맞춘문제 틀린문제 표시해서 보여줌
    let viewProblem = checkProblem.map(v => {
      return v.ok === true ? (
        <div
          className="span_em_default"
          key={v.num}
          style={{ backgroundColor: "green", padding: "0.5em 0 0.5em 0" }}
        >
          Number {v.num}. CORRECTED!! Average Correct Rate:{" "}
          {Math.round((v.okCount * 100) / v.tryCount)}%
        </div>
      ) : (
        <div
          className="span_em_default"
          key={v.num}
          style={{ backgroundColor: "red", padding: "0.5em 0 0.5em 0" }}
        >
          Number {v.num}. WRONG!! Average Correct Rate:{" "}
          {Math.round((v.okCount * 100) / v.tryCount)}%
        </div>
      );
    });
    return viewProblem;
  };

  render() {
    let {
      okCount,
      tryCount,
      commentCount,
      checkProblem,
      title
    } = this.props.data;
    let nickname = this.state.nickname;
    let correctProblem = checkProblem.filter(v => {
      //마자춘 문제수 측정용
      return v.ok === true;
    });
    let viewProblem = this.viewScoring(checkProblem); //만춘문제 틀린문제 뷰
    // const { evalQ, evalD, comment } = this.state;
    const UpperDiv = styled.div`
      width: 100%;
      margin-bottom: 2em;
      background-color: white;
    `;
    const AllChallengerContainer = styled.div`
      background-color: white;
      margin-bottom: 0.5em;
    `;
    const CommentContainer = styled.div`
      min-width: 50%;
      margin: 1em 0 1em 0;
    `;
    return (
      <div className="inline-flex" style={{ marginTop: "1em" }}>
        <Modal
          title="🥕FEEDBACK"
          visible={this.state.visible}
          okText="OK"
          cancelText="CANCEL"
          onOk={() => this.evalSubmit()}
          onCancel={() => this.cancel()}
        >
          <div className="eval-quality">
            <div className="eval-question">
              문제의 퀄리티가 어땠나요?(좋았어요:5점,구렸어요:1점)
            </div>
            <StarRatingComponent
              name="evalQuality"
              value={this.state.evalQ}
              starCount={5}
              onStarClick={nextValue => this.setEvalQ(nextValue)}
              starColor="yellow"
            />
          </div>
          <div className="eval-difficulty">
            <div className="eval-question">
              문제의 난이도는 어땠나요?(어려웠어요:5점,쉬웠어요:1점)
            </div>
            <StarRatingComponent
              name="evalDifficulty"
              value={this.state.evalD}
              starCount={5}
              onStarClick={nextValue => this.setEvalD(nextValue)}
              starColor="yellow"
            />
          </div>
          <this.CommentBOX className="input-comment" style={{}}>
            <span className="span_em_default">댓글</span>
            <textarea
              className="flex"
              style={{
                height: "2em",
                width: "100%"
              }}
              onChange={e => this.commentHandle(e)}
            />
          </this.CommentBOX>
        </Modal>
        <div className="center-parent fdc flex" style={{ padding: "0 0 0 0" }}>
          <UpperDiv className="nes-container with-title is-centered ">
            <p className="title"> SCORE! </p>
            <i className="snes-jp-logo is-small" />{" "}
            <span className="span_em_middle">
              {" "}
              {nickname ? nickname : "익명의 더쿠"}
              님의 {title} 점수
            </span>
          </UpperDiv>
          <div className="padding-zero nes-container is-dark with-title is-centered">
            <p>
              <span className="span_em_middle">
                {correctProblem.length} / {checkProblem.length}
              </span>
            </p>
            <i className="nes-icon trophy is-small" />
            <span className="span_em_middle">
              Your Correct Rate :{" "}
              {Math.round((correctProblem.length * 100) / checkProblem.length)}%
            </span>
          </div>

          <AllChallengerContainer className="nes-container">
            <p>
              <span className="span_em_middle">
                Challenger's Average Correct Rate :{" "}
                {Math.round((okCount * 100) / tryCount)}%
              </span>
            </p>
          </AllChallengerContainer>
          <div className="padding-zero nes-container">{viewProblem}</div>
          <CommentContainer>
            <button
              className="margin-center flex nes-btn is-primary"
              type="button"
              onClick={this.goComment}
            >
              COMMENT [{commentCount}]
            </button>
          </CommentContainer>
        </div>
      </div>
    );
  }
}

export default Scoring;
