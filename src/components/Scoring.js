import React, { Component } from "react";
import "../../node_modules/nes.css/css/nes.css";
import { Modal } from "antd";
import { config } from "../config";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
export class Scoring extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      hovEvalQ: 3,
      evalQ: 3,
      hovEvalD: 3,
      evalD: 3,
      comment: "",
      email: this.props.data.email
    };
  }

  goComment = () => {
    this.props.history.push(`/commnet/${this.props.data.problem_id}`);
  };
  evalSubmit() {
    alert(
      "프롭스로 넘어온 문제아이디:" +
        this.props.data.problem_id +
        "퀄리티평점:" +
        this.state.evalQ +
        "난이도평점:" +
        this.state.evalD +
        "댓글:" +
        this.state.comment
    );
    this.setState({ visible: false });
    axios
      .post(
        `http://localhost:8000/problem/evaluation`,
        {
          _id: this.props.data.problem_id,
          evalQ: this.state.evalQ,
          evalD: this.state.evalD,
          comments: this.state.comment,
          email: this.state.email
        },
        config
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  cancel(e) {
    this.setState({ visible: false });
  }
  setHoverEvalQ(e) {
    this.setState({
      hovEvalQ: e
    });
  }
  setHoverEvalD(e) {
    this.setState({
      hovEvalD: e
    });
  }
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
  commentHandle(e) {
    this.setState({ comment: e.target.value });
  }
  viewScoring = checkProblem => {
    //문제 오브젝트어레이 넣으면 맞춘문제 틀린문제 표시해서 보여줌
    let viewProblem = checkProblem.map(v => {
      return v.ok === true ? (
        <div
          key={v.num}
          style={{ backgroundColor: "green", padding: "20px 0 20px 0" }}
        >
          Number {v.num}. CORRECTED!! Average Correct Rate:{" "}
          {Math.round((v.okCount * 100) / v.tryCount)}%
        </div>
      ) : (
        <div
          key={v.num}
          style={{ backgroundColor: "red", padding: "20px 0px 20px 0px" }}
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
      problem_id,
      checkProblem,
      totalProblem
    } = this.props.data;
    // checkProblem = [
    //   //페이크 데이타
    //   { num: 1, okCount: 300, tryCount: 530, ok: true },
    //   { num: 2, okCount: 120, tryCount: 530, ok: false },
    //   { num: 3, okCount: 160, tryCount: 530, ok: true },
    //   { num: 4, okCount: 200, tryCount: 720, ok: false }
    // ];
    console.log("data받아온 rj", this.props.data);
    let correctProblem = checkProblem.filter(v => {
      //마자춘 문제수 측정용
      if (v.ok === true) {
        return v;
      }
    });
    let viewProblem = this.viewScoring(checkProblem); //만춘문제 틀린문제 뷰
    const { evalQ, evalD, comment } = this.state;
    return (
      <div>
        <Modal
          title="해당 문제 평가"
          visible={this.state.visible}
          okText="평가 완료"
          cancelText="닫기"
          onOk={() => this.evalSubmit()}
          onCancel={this.cancel}
        >
          <div>
            문제가 어땠나요?(좋았어요:5점,구렸어요:1점)
            <StarRatingComponent
              style={{ size: "100%" }}
              name="evalQuality"
              value={this.state.evalQ}
              starCount={5}
              onStarClick={nextValue => this.setEvalQ(nextValue)}
              onStarHover={nextValue => this.setHoverEvalQ(nextValue)}
              starColor="yellow"
            />
          </div>
          <div>
            문제가 어려웠나요?(어려웠어요:5점,쉬웠어요:1점)
            <StarRatingComponent
              name="evalDifficulty"
              value={this.state.evalD}
              starCount={5}
              onStarClick={nextValue => this.setEvalD(nextValue)}
              onStarHover={nextValue => this.setHoverEvalD(nextValue)}
              starColor="yellow"
            />
          </div>
          의견:<textarea onChange={e => this.commentHandle(e)}></textarea>
        </Modal>
        <div style={{ padding: "0 0 60px 30px" }}>
          <div className="nes-container with-title is-centered">
            <h1 className="title">SCORE!!</h1>
            <p>Hello, it's your score!</p>
          </div>

          <div className="nes-container is-dark with-title">
            <p className="title">correct!!</p>
            <p>
              {correctProblem.length} / {totalProblem}
            </p>
            <p>
              Your Correct Rate :{" "}
              {Math.round((correctProblem.length * 100) / totalProblem)}%
            </p>
          </div>

          <div className="nes-container is-rounded">
            <p>
              Total Average Correct Rate :{" "}
              {Math.round((okCount * 100) / tryCount)}%
            </p>
          </div>

          <div className="nes-container is-rounded">{viewProblem}</div>
          <button
            type="button"
            className="nes-btn is-primary"
            onClick={this.goComment}
          >
            COMMENT [{commentCount}]
          </button>
        </div>
      </div>
    );
  }
}

export default Scoring;