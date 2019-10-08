import React from "react";
import { Popconfirm } from "antd";
import "../shared/App.css";
import { formatRelative } from "date-fns";
import styled from "styled-components";
import CopyUrl from "../components/CopyUrl";

let uniqid = require("uniqid");
let isDev = process.env.REACT_APP_LOG;

class MyProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: this.props.history.location.state.userInfo.problems
    };
  }

  componentDidMount() {
    isDev && console.log(this.state.problems);
  }
  solving(id) {
    this.props.history.push(`/SolvingProblem/${id}`);
  }
  render() {
    const ImageBox = styled.div`
      width: 100%;
      height: 8em;
    `;

    const problems = this.state.problems;
    let cards = problems.map(items => (
      <div key={items._id + uniqid("key")}>
        <Popconfirm
          key={items.problem_id + "_Popconfirm" + uniqid("k")}
          title="다시 풀어 볼래요?"
          onConfirm={() => {
            this.solving(items._id);
          }}
          onCancel={this.cancel}
          okText="Yes"
          cancelText="No"
          placement="top"
        >
          <div
            key={items.problem_id + "_Card" + uniqid("k")}
            style={{
              padding: "0 0 0.5em !important",
              marginBottom: "2em"
            }}
            className="nes-container nes-container-hard with-title is-rounded is-centered"
          >
            <p
              className="title"
              style={{
                marginBottom: "0px"
              }}
            >
              <span className="span_em_default">{items.title} </span>
            </p>
            <div
              className="flex-container-col is-rounded is-centered"
              style={{
                marginBottom: "-7px"
              }}
            >
              <ImageBox className="margin-center thumbnail-wrap">
                <CopyUrl id={items._id} />
                <img className="thumbnail" src={items.img} alt="place" />
              </ImageBox>
              <div className="flex-container-row margin-center">
                <span
                  className="nes-text is-primary span_em_small word-break margin-center center-center-series flex"
                  style={{
                    // display: "block"
                    height: "fit-content"
                  }}
                >
                  {" "}
                  {formatRelative(new Date(items.date), new Date())}
                </span>
              </div>
            </div>
          </div>
        </Popconfirm>
      </div>
    ));

    if (problems.length === 0) {
      return (
        <div className="max-width nes-container-normal nes-container  with-title is-centered filling_child">
          <p className="title">
            <span className="font-2P span_em_default"> MY PROBLEM </span>
          </p>
          <div className="top-container flex fdc">{null}</div>
          <div
            className="middle-container flex fdc margin-center"
            style={{ marginBottom: "45px" }}
          >
            <span className="font-2P span_em_l"> No HISTORY </span>
          </div>
          <div className="bottom-container flex fdc">{null}</div>
        </div>
      );
    } else {
      return (
        <div className="max-width nes-container-normal nes-container  with-title is-centered filling_child">
          <p className="title">
            <span className="font-2P span_em_default"> MY PROBLEM </span>
          </p>
          <div className="top-container flex fdc">{null}</div>
          <div className="middle-container flex fdc">{cards}</div>
          <div className="bottom-container flex fdc">{null}</div>
        </div>
      );
    }
  }
}
export default MyProblem;
