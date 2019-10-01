import React from "react";
import styled from "styled-components";
import { formatRelative } from "date-fns";
import { Popconfirm } from "antd";
import "../shared/App.css";

let uniqid = require("uniqid");

class MySolved extends React.Component {
  constructor(props) {
    super(props);
  }

  confirm(problemId) {
    this.props.history.push("/SolvingProblem/" + problemId);
  }

  static cancel() {
    console.log("취소");
  }

  //     const Box = styled.div`
  //   /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
  //   background: ${props => props.color || 'blue'};
  //   padding: 1rem;
  //   display: flex;
  // `;
  //  ==> 함수형 컴포넌트로 만들어서 쓸대 필요함.

  //   /* & 문자를 사용하여 Sass 처럼 자기 자신 선택 가능 */
  //   &:hover {
  //     background: rgba(255, 255, 255, 0.9);
  //   }

  render() {
    const Card = styled.div`
      padding: 0 0 0.5em !important;
    `;

    const ImageBox = styled.div`
      height: 8em;
      width: 70%;
    `;

    const { solution } = this.props.history.location.state.userInfo;
    const historyList = solution.map(el => {
      return (
        <Popconfirm
          key={el.problem_id + "_Popconfirm" + uniqid("k")}
          title="다시 풀어 볼래요?"
          onConfirm={() => {
            this.confirm(el.problem_id);
          }}
          onCancel={this.cancel}
          okText="Yes"
          cancelText="No"
          placement="top"
        >
          <Card
            key={el.problem_id + "_Card" + uniqid("k")}
            className="nes-container with-title is-rounded"
          >
            <p className="title"> {el.title} </p>
            <div className="flex-container-row is-rounded is-centered">
              <div className="left-col flex-container-col">
                <span className="nes-text is-error flex">
                  님 정답률!{el.successRate}%
                </span>
                <span className="nes-text is-primary flex">
                  언제 풀었어? {formatRelative(new Date(el.date), new Date())}
                </span>
              </div>
              <ImageBox className="flex-fixer thumbnail-wrap">
                <img className="thumbnail" src={el.img} alt="image place" />
              </ImageBox>
            </div>
          </Card>
        </Popconfirm>
      );
    });
    return (
      <div className="nes-container with-title">
        <p className="title"> 풀었던 문제들 </p>
        <div className="top-container">{null}</div>
        <div className="middle-container">{historyList}</div>
        <div className="bottom-container">{null}</div>
      </div>
    );
  }
}
export default MySolved;
