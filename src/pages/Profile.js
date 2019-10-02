import React, { Component } from "react";
import {axiosInstance, config} from "../config";
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
      isLoading: false,
      imageBtn: false,
      nickChangeBtn: false,
      curImg: "",
      curNick: "",
      userInfo: {
        nickname: null,
        tier: null,
        img: null,
        answerCount: null,
        totalProblemCount: null
      }
    };
  }

  componentDidMount() {
    config.email = this.props.email;
    axiosInstance
      .get(`/account/info`, config)
      .then(res => this.setState({ userInfo: res.data, isLoading: true }))
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
      axiosInstance
        .post(
            '/account/img',
          {
            img: this.state.curImg
          },
          config
        )
        .then(res => console.log(res))
        .catch(err => console.log("사진 업로드 요청관련에러:" + err));
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
      axiosInstance
        .post(
            '/account/nick',
          {
            nick: this.state.curNick
          },
          config
        )
        .then(res => console.log(res))
        .catch(err => console.log("닉 변경 요청 관련 에러:" + err));
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
    const isLoading = this.state.isLoading;
    const imgBtn = this.state.imageBtn;
    const nickBtn = this.state.nickChangeBtn;
    console.log(this.state.userInfo);

    if (!isLoading) {
      return <div>LOADING</div>;
    } else {
      return (
        <div>
          <div>
            {!imgBtn && img ? (
              <div>
                {/*<img src={img} alt="본인계정이미지" height="200" width="300" />*/}
                {/*<button onClick={() => this.uploadImage1()}>이미지 변경</button>*/}
              </div>
            ) : !imgBtn && !img ? (
              <div>
                {/*<div>계정에 설정한 이미지가 없습니다.</div>*/}
                {/*<button onClick={() => this.uploadImage1()}>이미지 설정</button>*/}
              </div>
            ) : (
              <div>
                <input type="file" onChange={e => this.profileImg(e)}></input>
                <button onClick={() => this.uploadImage2()}>
                  이미지 업로드
                </button>
              </div>
            )}
          </div>
          <div>
            <p>My Profile</p>
            <div>
              {!nickBtn && nickname ? (
                <div>
                  {/*닉네임: {nickname}*/}
                  {/*<button onClick={() => this.changeNick1()}>*/}
                  {/*  닉네임 변경*/}
                  {/*</button>*/}
                </div>
              ) : !nickBtn && !nickname ? (
                <div>
                  {this.props.email}님의 닉네임이 없습니다.
                  차후에 지원예정
                  {/*<button onClick={() => this.changeNick1()}>*/}
                  {/*  닉네임 등록*/}
                  {/*</button>*/}
                </div>
              ) : (
                <div>
                  닉네임{" "}
                  <input
                    type="text"
                    id="nick-input"
                    onChange={e => this.changeInput(e)}
                    defaultValue={nickname}
                  />
                  <button onClick={() => this.changeNick2()}>변경 적용</button>
                </div>
              )}
            </div>
            <p>
              정답률:{(answerCount / totalProblemCount) * 100}%(총{" "}
              {totalProblemCount}문제 중 {answerCount}문제를 맞히셨습니다.)
            </p>
            {/*<p>My Tier:{tier}</p>*/}
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
}
export default Profile;
