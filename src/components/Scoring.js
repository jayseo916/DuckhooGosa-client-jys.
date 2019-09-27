import React, { Component } from "react";
import "../../node_modules/nes.css/css/nes.css";
import { Modal } from "antd";
import { config } from "../config";
import axios from "axios";
export class Scoring extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: true,
      evalQ:"",
      evalD:"",
      comment:""
    }
  }
  
  goComment = () => {
    this.props.history.push(`/commnet/${this.props.data.problemId}`);
  };
  componentDidMount() {

  }
  evalSubmit(prop, evalQual, evalDiff, comment) {
    alert(JSON.stringify(prop));
    this.setState({ visible: false })
    axios.post(`http://localhost:8000/problem/evaluation`,{
      _id: prop, 
      evalQ: evalQual,
      evalD: evalDiff,
      comments: comment
    }, config)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }
  cancel(e) {
    this.setState({visible: false})
  }
  commentHandle(e) {
    this.setState({comment:e.target.value.trim()})
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
      problemId,
      checkProblem,
      totalProblem
    } = this.props.data;
    checkProblem = [
      //페이크 데이타
      { num: 1, okCount: 300, tryCount: 530, ok: true },
      { num: 2, okCount: 120, tryCount: 530, ok: false },
      { num: 3, okCount: 160, tryCount: 530, ok: true },
      { num: 4, okCount: 200, tryCount: 720, ok: false }
    ];
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
        onOk={() => this.evalSubmit(problemId, evalQ, evalD, comment)} 
        onCancel={this.cancel}>
        <div>문제가 어땠나요?(좋았어요:5점,구렸어요:1점)</div>
        <div>문제가 어려웠나요?(어려웠어요:5점,쉬웠어요:1점)</div>
        의견:<input type="text" onChange={e => this.commentHandle(e)}></input>
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
