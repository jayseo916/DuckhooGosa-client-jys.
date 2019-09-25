import React from "react";
import axios from "axios";
import { Popconfirm } from "antd";
import "../shared/App.css";
import { formatRelative } from "date-fns";
import styled from "styled-components";

class MyProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [
        {
          _id: "1",
          title: "덕후라능",
          date: new Date(),
          representImg:
            "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/seoul.jpg"
        },
        {
          _id: "2",
          title: "I am gamemania",
          date: new Date(),
          representImg:
            "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/Screen+Shot+2019-07-27+at+20.58.12.png"
        },
        {
          _id: "3",
          title: "오덕오덕",
          date: new Date(),
          representImg:
            "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/Mon+Sep+23+2019+16%3A54%3A26+GMT%2B0900+(Korean+Standard+Time)+file1/Screen+Shot+2019-09-17+at+10.21.08+AM.png"
        },
        {
          _id: "4",
          title: "오덕",
          date: new Date(),
          representImg:
            "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/Mon+Sep+23+2019+17%3A02%3A25+GMT%2B0900+(Korean+Standard+Time)+file1/Screen+Shot+2019-09-19+at+1.26.59+PM.png"
        }
      ]
    };
  }
  componentDidMount() {
    // axios
    //   .get(
    //     `http://localhost:8000/?email=${this.props.location.state.userInfo.email}`
    //   )
    //   .then(res => this.setState({ problems: res })) // 응답으로 problemSchema의 제목,날짜,대표이미지를 받아
    //   .catch(err => console.log("본인이 낸 문제 가져오기err:" + err));
  }
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
    if (problems.length !== 0) {
      return (
        <div>
          {problems.map(items => (
            <div key={items._id}>
              <Popconfirm
                title="해당 문제를 푸시겠습니까?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => this.solving(items._id)}
                placement="left"
              >
                <Card
                  key={items._id}
                  className="nes-container with-title is-rounded"
                >
                  <p className="title"> {items.title} </p>
                  <div className="flex-container-row is-rounded is-centered">
                    <div className="left-col flex-container-col">
                      <span className="nes-text is-primary flex">
                        문제 발행일: {formatRelative(items.date, new Date())}
                      </span>
                    </div>
                    <ImageBox className="flex-fixer thumbnail-wrap">
                      <img
                        className="thumbnail"
                        src={items.representImg}
                        alt="image place"
                      />
                    </ImageBox>
                  </div>
                </Card>
              </Popconfirm>
            </div>
          ))}
        </div>
      );
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
