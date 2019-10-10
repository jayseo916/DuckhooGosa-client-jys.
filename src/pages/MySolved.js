import React from "react";
import styled from "styled-components";
import { formatRelative } from "date-fns";
import { Popconfirm } from "antd";
import "../shared/App.css";
import CopyUrl from "../components/CopyUrl";

let uniqid = require("uniqid");
let isDev = null;
if (process.env.REACT_APP_LOG === "TRUE") {
  isDev = true;
}

class MySolved extends React.Component {
  confirm(problemId) {
    this.props.history.push("/SolvingProblem/" + problemId);
  }
  problemInfo(id) {
    this.props.history.push("/comment/" + id);
  }
  static cancel() {
    // console.log("취소");
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
      width: 100%;
    `;
    const { solution } = this.props.history.location.state.userInfo;
    const historyList = solution.map(el => {
      return (
        <div key={el.problem_id + "_Popconfirm" + uniqid("k")}>
          <Popconfirm
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
              style={{
                marginBottom: "2em"
              }}
              className="nes-container nes-container-hard with-title is-rounded is-centered"
            >
              <span className="span_em_default">{el.title} </span>
              <div
                className="flex-container-col is-rounded is-centered"
                style={{
                  marginBottom: "-7px"
                }}
              >
                <ImageBox className="margin-center thumbnail-wrap">
                  <CopyUrl id={el.problem_id} />
                  <img className="thumbnail" src={el.img} alt="place" />
                </ImageBox>
                <div className="flex-container-row margin-center">
                  <span className="flex nes-text is-error span_em_small word-break">
                    <a href="#self" className="nes-badge is-splited">
                      <span className="is-dark">Hit</span>
                      <span className="is-success">{el.successRate}%</span>
                    </a>
                  </span>
                  <div>
                    <button
                      className="nes-btn padding-zero-only"
                      style={{
                        marginLeft: "0.3em"
                      }}
                      onClick={() => this.problemInfo(el.problem_id)}
                    >
                      <span className="span_em_small">Read more..</span>
                    </button>
                  </div>
                </div>
                <div className="flex-container-row margin-center">
                  <span
                    className="nes-text is-primary span_em_small word-break margin-center center-center-series flex"
                    style={{
                      // display: "block"
                      height: "fit-content"
                    }}
                  >
                    {" "}
                    {formatRelative(new Date(el.date), new Date())}
                  </span>
                </div>
              </div>
            </Card>
          </Popconfirm>
        </div>
      );
    });
    return (
      <div className="max-width nes-container-normal nes-container  with-title is-centered filling_child">
        <p className="title">
          <span className="font-2P span_em_default"> HISTORY </span>
        </p>
        <div className="top-container flex fdc">{null}</div>
        <div
          className="middle-container flex fdc"
          style={{ marginBottom: "45px" }}
        >
          {historyList}
        </div>
        <div className="bottom-container flex fdc">{null}</div>
        <div className="top-container"></div>
        <div className="middle-container">{historyList}</div>
        <div className="bottom-container">{null}</div>
      </div>
    );
  }
}
export default MySolved;
