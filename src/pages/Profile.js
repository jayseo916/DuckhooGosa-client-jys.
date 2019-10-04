import React, { Component } from "react";
import { axiosInstance, config } from "../config";
import { Link } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { Collapse } from "antd";

import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";

const { Panel } = Collapse;
//FAQ&문의메일 설명 내용
const text =
  " 사용방법\n기본적으로 로그인이 필요하고 편하게 구글로그인 하시면 됩니당";
// 문제 만드는법
// 1.로그인
// 2.만들기
// 3.문제에 필요한 파일(사진,오디오,동영상)을 업로드 후 문제 작성
// 4.보기는 주관식과 2지선다부터 5지선다까지 있다. 원하는 걸 골라서 만들면 된다.
// 5.문제를 작성했으면 다음문제 버튼을 눌러 다음 문제를 작성한다. 이때 다음문제 버튼을 누르면 자동으로 저장이 된다.
// 6.수정을 원하면 이전문제 버튼을 누르고 수정을 하면된다. 수정을 반영하려면 저장버튼을 꼭 누른다.
// 7.현재 작성중인 문제를 반영하려면 저장을 누른후 제출한다. 저장을 누르지 않고 작성도중에 제출하면 작성중인 문제는 저장되지 않는다.
// 8.작성한 문제를 확인하고 완료를 누르면 문제지 작성이 완료된다. 수정을 원하면 수정버튼을 눌르고 수정을 한다. 이때도 수정한 문제는 저장버튼을 눌러준다.

// 문제 푸는법
// 1. 로그인
// 2. 문제 클릭
// 3. 해당 문제를 푼다. 객관식의 경우 답이 여러개일 수 있다.
// 4. 모두 풀고 제출하면 채점후 결과가 나오는데 난이도와 문제 퀄리티 두종류의 평점을 을 매기고 코멘트를 달 수 있다.

// 이멜: 111@gmail.com
// "

function callback(key) {
  console.log(key);
}
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
    console.log("함수", this.props.emptyEamil);
    config.email = this.props.email;
    axiosInstance
      .get(`/account/info`, config)
      .then(res => this.setState({ userInfo: res.data, isLoading: true }))
      .catch(err => console.log("프로필가져오기에러:" + err));
  }

  logout = () => {
    axiosInstance
      .post("/logout", {}, config)
      .then(res => {
        if (res.data.result) {
          console.log(res.data.result);
        } else {
          console.log(res.data.reason);
        }
      })
      .catch(err => {
        console.log(err, "ERROR in logout SEQ");
      });
    console.log("로그아웃");
    this.props.emptyEmail();
    localStorage.removeItem("authData");
  };

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
          "/account/img",
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
          "/account/nick",
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
                  {this.props.email}님의 닉네임이 없습니다. 차후에 지원예정
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
          <GoogleLogout
            clientId={process.env.REACT_APP_Google}
            buttonText="Logout"
            onLogoutSuccess={this.logout}
          />
          <Collapse onChange={callback}>
            <Panel header="FAQ/Email" key="1">
              <p>사용방법</p>
              <p>
                기본적으로 로그인이 필요하고 편하게 구글로그인 하시면 됩니당
              </p>
              <p> 문제 만드는법</p>
              <p>1.로그인</p>
              <p>2.만들기</p>
              <p>
                3.문제에 필요한 파일(사진,오디오,동영상)을 업로드 후 문제 작성
              </p>
              <p>
                4.보기는 주관식과 2지선다부터 5지선다까지 있다. 원하는 걸 골라서
                만들면 된다.
              </p>
              <p>
                5.문제를 작성했으면 다음문제 버튼을 눌러 다음 문제를 작성한다.
                이때 다음문제 버튼을 누르면 자동으로 저장이 된다.
              </p>
              <p>
                6.수정을 원하면 이전문제 버튼을 누르고 수정을 하면된다. 수정을
                반영하려면 저장버튼을 꼭 누른다.
              </p>
              <p>
                7.현재 작성중인 문제를 반영하려면 저장을 누른후 제출한다. 저장을
                누르지 않고 작성도중에 제출하면 작성중인 문제는 저장되지 않는다.
              </p>
              <p>
                8.작성한 문제를 확인하고 완료를 누르면 문제지 작성이 완료된다.
                수정을 원하면 수정버튼을 눌르고 수정을 한다. 이때도 수정한
                문제는 저장버튼을 눌러준다.
              </p>

              <p>문제 푸는법</p>
              <p>1. 로그인</p>
              <p>2. 문제 클릭</p>
              <p>3. 해당 문제를 푼다. 객관식의 경우 답이 여러개일 수 있다.</p>
              <p>
                4. 모두 풀고 제출하면 채점후 결과가 나오는데 난이도와 문제
                퀄리티 두종류의 평점을 을 매기고 코멘트를 달 수 있다.
              </p>

              <p>문의사항: 111@gmail.com</p>
            </Panel>
          </Collapse>
        </div>
      );
    }
  }
}
export default Profile;
