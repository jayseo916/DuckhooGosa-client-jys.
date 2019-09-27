import React, { Component } from "react";
import axios from "axios";
import { config } from "../config";
import { Link } from "react-router-dom";

class Profile extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   userInfo: "",
    //   nickChangeBtn: false,
    //   imageBtn: false,
    //   curImg: "",
    //   curNick: ""
    // };
    this.state = {
      // 서버연결되기 전까지 임시로 설정
      imageBtn: false,
      nickChangeBtn: false,
      curImg: "",
      curNick: "",
      userInfo: {
        email: "god@gmail.com",
        nickname: "",
        img: "",
        tier: "Gold",
        answerCount: 42,
        totalProblemCount: 60,
        solutions: [
          {
            problem_id: "1",
            solved_date: new Date()-1000*60*60*24*1000,
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
            ],
            successRate: 50,
            title: "바보대전1",
            img:
              "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/title-image-example.jpg"
          },
          {
            problem_id: "2",
            solved_date: new Date()-1000*60*60*24*10000,
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
            ],
            successRate: 20,
            title: "바보대전2",
            img:
              "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/title-image-example.jpg"
          },
          {
            problem_id: "3",
            solved_date: new Date()-1000*60*60*24*100000,
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
            ],
            successRate: 70,
            title: "바보대전3",
            img:
              "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/practice01/title-image-example.jpg"
          }
        ]
      }
    };
  }
  componentDidMount() {
    // 실제서버 db와 연동되면 사용
    const id = localStorage.getItem("");
    axios
      .get(`http://localhost:8000/account/info`, config)
      .then(res => this.setState({ userInfo: res }))
      .catch(err => console.log("프로필가져오기에러:" + err));
  }
  uploadImage1() {
    this.setState({ imageBtn: !this.state.imageBtn });
  }
  profileImg(e) {
    let img;
    let target = e.target || window.event.srcElement,
      files = target.files;
    if (FileReader && files && files.length) {
      let fr = new FileReader();
      fr.onload = () => {
        img = fr.result;
        this.setState({
          curImg: img
        });
      };
      fr.readAsDataURL(files[0]);
    }
  }
  uploadImage2() {
    if (!this.state.curImg) {
      alert("사진을 업로드해 주세요.");
    } else {
      axios.post("http://localhost:8000/account/img",{
        img: this.state.curImg
      }, config)
      .then(res => console.log(res))
      .catch(err => console.log("사진 업로드 요청관련에러:"+err));
      this.setState({ imageBtn: !this.state.imageBtn });
      this.setState({
        userInfo: {
          ...this.state.userInfo,
          img: this.state.curImg
        }
      });
    }
  }
  changeNick1() {
    this.setState({ nickChangeBtn: !this.state.nickChangeBtn });
  }
  changeInput(e) {
    let notEmpty = e.target.value.trim();
    this.setState({ curNick: notEmpty });
  }
  changeNick2() {
    if (!this.state.curNick) {
      alert("바꿀 닉네임을 적어주세요");
    } else {
      axios.post("http://localhost:8000/account/nick", {
        nick: this.state.curNick
      }, config)
      .then(res => console.log(res))
      .catch(err => console.log("닉 변경 요청 관련 에러:"+err));
      this.setState({ nickChangeBtn: !this.state.nickChangeBtn });
      this.setState({
        userInfo: {
          ...this.state.userInfo,
          nickname: this.state.curNick
        }
      });
    }
  }
  render() {
    const {
      nickname,
      tier, // 티어(등급)
      img, // 이미지
      answerCount, // 정답 갯수
      totalProblemCount // 푼 문제갯수
    } = this.state.userInfo;
    const imgBtn = this.state.imageBtn;
    const nickBtn = this.state.nickChangeBtn;
    console.log(this.state.userInfo);
    return (
      <div>
        <div>
          {!imgBtn && img ? (
            <div>
              <img
                src={img}
                alt="본인계정이미지"
                height="200"
                width="300"
              ></img>
              <button onClick={() => this.uploadImage1()}>이미지 변경</button>
            </div>
          ) : !imgBtn && !img ? (
            <div>
              <div>계정에 설정한 이미지가 없습니다.</div>
              <button onClick={() => this.uploadImage1()}>이미지 설정</button>
            </div>
          ) : (
            <div>
              <input type="file" onChange={e => this.profileImg(e)}></input>
              <button onClick={() => this.uploadImage2()}>이미지 업로드</button>
            </div>
          )}
        </div>
        <div>
          <p>My Profile</p>
          <div>
            {!nickBtn && nickname ? (
              <div>
                닉네임: {nickname}
                <button onClick={() => this.changeNick1()}>닉네임 변경</button>
              </div>
            ) : !nickBtn && !nickname ? (
              <div>
                닉네임: 해당유저는 닉네임이 없습니다 옆의 버튼을 눌러 닉네임을
                등록하세요!
                <button onClick={() => this.changeNick1()}>닉네임 등록</button>
              </div>
            ) : (
              <div>
                닉네임{" "}
                <input
                  type="text"
                  id="nick-input"
                  onChange={e => this.changeInput(e)}
                  defaultValue={nickname}
                ></input>
                <button onClick={() => this.changeNick2()}>변경 적용</button>
              </div>
            )}
          </div>
          <p>
            정답률:{(answerCount / totalProblemCount) * 100}%(총{" "}
            {totalProblemCount}문제 중 {answerCount}문제를 맞히셨습니다.)
          </p>
          <p>My Tier:{tier}</p>
        </div>
        <div>
          <Link
            to={{
              pathname: "/mySolved",
              state: {
                userInfo: this.state.userInfo
              }
            }}
          >
            <button>풀었던 문제 History</button>
          </Link>
          <Link
            to={{
              pathname: "/myProblem",
              state: {
                userInfo: this.state.userInfo
              }
            }}
          >
            <button>만든문제 History</button>
          </Link>
        </div>
      </div>
    );
  }
}
export default Profile;
