import React from "react";
import { Popconfirm } from "antd";
import "../shared/App.css";
import { formatRelative } from "date-fns";
import styled from "styled-components";
import CopyUrl from "../components/CopyUrl";

let uniqid = require("uniqid");

class MyProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: this.props.history.location.state.userInfo.problems
    };
  }

  componentDidMount() {}
  solving(id) {
    this.props.history.push(`/SolvingProblem/${id}`);
  }
  render() {
    const Card = styled.div`
      padding: 1 0 0.5em !important;
    `;

    const ImageBox = styled.div`
      height: 7em;
      width: 60%;
    `;

    const problems = this.state.problems;
    let cards = problems.map(items => (
      <div key={items._id + uniqid("key")}>
        <Popconfirm
          title="해당 문제를 푸시겠습니까?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => this.solving(items._id)}
          placement="left"
        >
          <Card
            key={items._id + uniqid("key")}
            className="nes-container with-title is-rounded"
          >
            <p className="title"> {items.title} </p>
            <div className="flex-container-row is-rounded is-centered">
              <div className="left-col flex-container-col">
                <span className="nes-text is-primary flex">
                  문제 발행일:{" "}
                  {formatRelative(new Date(items.date), new Date())}
                </span>
                <CopyUrl id={items._id} />
              </div>
              <ImageBox className="flex-fixer thumbnail-wrap">
                <img className="thumbnail" src={items.img} alt="place" />
              </ImageBox>
            </div>
          </Card>
        </Popconfirm>
      </div>
    ));

    if (problems.length !== 0) {
      return <div>{cards}</div>;
    } else {
      return (
        <div className="nes-container with-title is-rounded">
          해당 회원이 낸 문제가 없습니다! 문제를 내 보세요
        </div>
      );
    }
  }
}
export default MyProblem;
