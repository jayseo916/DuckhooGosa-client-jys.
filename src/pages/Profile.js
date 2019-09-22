import React, { Component } from "react";
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   userInfo: "",
    //   nickChangeBtn: false
    // };
    this.state = {
      // 서버연결되기 전까지 임시로 설정
      userInfo: {
        _id: "123",
        email: "god@gmail.com",
        nickname: "왼팔의 흑염룡",
        tier: "Sliver",
        answerCount: 63,
        totalProblemCount: 120,
        solutions: [
          {
            problem_id: "1",
            solved_date: new Date(),
            answer: [
              "a",
              "b",
              [1, 2, 3],
              5,
              2,
              3,
              4,
              1,
              1,
              2,
              3,
              3,
              [1, 5],
              [1, 2],
              "b",
              "god",
              "gg",
              2,
              4,
              1
            ]
          },
          {
            problem_id: "2",
            solved_date: new Date(),
            answer: [
              "a",
              "b",
              [1, 2, 3],
              5,
              2,
              3,
              4,
              1,
              1,
              2,
              3,
              3,
              [1, 5],
              [1, 2],
              "b",
              "god",
              "gg",
              2,
              4,
              1
            ]
          },
          {
            problem_id: "3",
            solved_date: new Date(),
            answer: [
              "a",
              "b",
              [1, 2, 3],
              5,
              2,
              3,
              4,
              1,
              1,
              2,
              3,
              3,
              [1, 5],
              [1, 2],
              "b",
              "god",
              "gg",
              2,
              4,
              1
            ]
          },
          {
            problem_id: "4",
            solved_date: new Date(),
            answer: [
              "a",
              "b",
              [1, 2, 3],
              5,
              2,
              3,
              4,
              1,
              1,
              2,
              3,
              3,
              [1, 5],
              [1, 2],
              "b",
              "god",
              "gg",
              2,
              4,
              1
            ]
          },
          {
            problem_id: "5",
            solved_date: new Date(),
            answer: [
              "a",
              "b",
              [1, 2, 3],
              5,
              2,
              3,
              4,
              1,
              1,
              2,
              3,
              3,
              [1, 5],
              [1, 2],
              "b",
              "god",
              "gg",
              2,
              4,
              1
            ]
          }
        ]
      }
    };
  }
  componentDidMount() {
    // 실제서버 db와 연동되면 사용
    // const id = localStorage.getItem("");
    // axios
    //   .get(`http://localhost:8000/account/info`)
    //   .then(res => this.setState({ userInfo: res }))
    //   .catch(err => console.log("프로필가져오기에러:" + err));
  }
  uploadImage() {
    
  }
  changeNick() {
    
  }
  myAnswerHistory() {
    this.props.history.push("/MySolved");
  }
  myCreatedHistoy() {
    this.props.history.push("/MyProblem");
  }
  render() {
    const {
      nickname, // 닉네임
      tier, // 티어(등급)
      answerCount, // 정답 갯수
      totalProblemCount // 푼 문제갯수
    } = this.state.userInfo;
    return (
      <div>
        <div>
          <button onClick={() => this.uploadImage()}>이미지 업로드</button>
        </div>
        <div>
          <p align="center">My Profile</p>
          <p>
            닉네임:{nickname}
            <button onClick={() => this.changeNick()}>닉네임 변경</button>
          </p>
          <p>
            정답률:{(answerCount / totalProblemCount) * 100}%(총{" "}
            {totalProblemCount}문제 중 {answerCount}문제를 맞히셨습니다.)
          </p>
          <p>My Tier:{tier}</p>
        </div>
        <div>
          <button onClick={() => this.myAnswerHistory()}>
            정답제출 History
          </button>
          <button onClick={() => this.myCreatedHistoy()}>
            만든문제 History
          </button>
        </div>
      </div>
    );
  }
}
export default Profile;
