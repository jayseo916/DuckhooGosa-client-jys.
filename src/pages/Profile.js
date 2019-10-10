import React, { Component } from "react";
import { axiosInstance, config } from "../config";
import { Link } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { Collapse } from "antd";
import { UploadToS3 } from "../client/upLoad";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.css";
import "../shared/App.css";
import styled from "styled-components";

const { Panel } = Collapse;
let isDev = null;
if (process.env.REACT_APP_LOG === "TRUE") {
  isDev = true;
}

function callback(key) {
  isDev && console.log(key);
}
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.ProfileButton = styled.div`
      margin: 0.3em 0 0.5em 0;
    `;
  }

  componentDidMount() {
    config.email = this.props.email;
    axiosInstance
      .get(`/account/info`, config)
      .then(res => {
        isDev && console.log(res.data);
        this.setState({ userInfo: res.data, isLoading: true });
      })
      .catch(err => isDev && console.log("프로필가져오기에러:" + err));
  }

  logout = () => {
    axiosInstance
      .post("/logout", {}, config)
      .then(res => {
        if (res.data.result) {
          isDev && console.log(res.data.result);
        } else {
          isDev && console.log(res.data.reason);
        }
      })
      .catch(err => {
        isDev && console.log(err, "ERROR in logout SEQ");
      });
    isDev && console.log("로그아웃");
    this.props.emptyEmail();
    localStorage.clear();
  };

  uploadImage1() {
    this.setState({ imageBtn: !this.state.imageBtn });
  }

  profileImg(e) {
    let fileKind = e.target.value.lastIndexOf(".");
    let fileName = e.target.value.substring(fileKind + 1, e.length);
    let fileType = fileName.toLowerCase();
    let checkFileType = ["jpg", "gif", "png", "jpeg", "bmp"];

    if (checkFileType.indexOf(fileType) === -1) {
      alert("확장자가 jpg, gif, png, jpeg, bmp인 이미지 파일만 올려주세요.");
      e.target.value = "";
      return false;
    } else if (e.target.files && e.target.files[0].size > (5 * 1024 * 1024)) {
      alert("업로드할 파일의 용량이 5mb가 넘습니다.")
      e.target.value = "";
    } else {
      this.setState({
        curImg: e.target.files[0]
      });
    }
  }
  async uploadImage2() {
    let memberImageDir = "memberImageDir";
    if (!this.state.curImg) {
      alert("사진을 선택해 주세요.");
    } else {
      let img = await new Promise((resolve, reject) => {
        try {
          UploadToS3(memberImageDir, this.state.curImg, link => {
            resolve(link);
          });
        } catch (err) {
          reject(err);
        }
      });
      isDev && console.log(1);
      await this.setState(
        {
          curImg: img
        },
        () => {
          isDev && console.log(2);
        }
      );
      isDev && console.log(3);
      await axiosInstance
        .post(
          "/account/img",
          {
            img: this.state.curImg
          },
          config
        )
        .then(res => isDev && console.log(res, "4"))
        .catch(err => isDev && console.log("사진 업로드 요청관련에러:" + err));
      await this.setState(
        {
          userInfo: {
            ...this.state.userInfo,
            img: this.state.Img
          }
        },
        () => {
          isDev && console.log(5);
        }
      );
      isDev && console.log(6);
      await this.setState({ imageBtn: !this.state.imageBtn }, () => {
        isDev && console.log(7);
      });

      axiosInstance
        .get(`/account/info`, config)
        .then(res => {
          isDev && console.log("데이터 갱신측 콜");
          this.setState({ userInfo: res.data, isLoading: true });
        })
        .catch(err => isDev && console.log("프로필가져오기에러:" + err));
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
        .then(res => isDev && console.log(res))
        .catch(err => isDev && console.log("닉 변경 요청 관련 에러:" + err));
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

    if (!isLoading) {
      return <div>LOADING</div>;
    } else {
      return (
        <div className="max-width pageCSS-white fdc filling_parent">
          <div
            className="nes-container nes-container-normal with-title is-centered margin-center filling_child"
            style={{
              flexWrap: "wrap",
              paddingBottom: "3em",
              marginBottom: "45px"
            }}
          >
            <p className="title font-2P">
              <span className="title span_em_middle">Profile</span>
            </p>
            <div>
              {!imgBtn && img ? (
                <div>
                  <img
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "50%"
                    }}
                    src={img}
                    alt="본인계정이미지"
                    height="200"
                    width="300"
                  />{" "}
                  <this.ProfileButton
                    className="nes-btn is-warning"
                    onClick={() => this.uploadImage1()}
                  >
                    이미지 변경
                  </this.ProfileButton>
                </div>
              ) : !imgBtn && !img ? (
                <div>
                  <div>
                    <span className="span_em_default">
                      {" "}
                      계정에 설정한 이미지가 없습니다.{" "}
                    </span>
                  </div>
                  <this.ProfileButton
                    className="nes-btn is-primary"
                    onClick={() => this.uploadImage1()}
                  >
                    이미지 설정
                  </this.ProfileButton>
                </div>
              ) : (
                <div>
                  <label htmlFor="fileX" className="label-input" />
                  <input
                    type="file"
                    id="fileX"
                    accept="image/*"
                    onChange={e => this.profileImg(e)}
                  />
                  <this.ProfileButton
                    className="nes-btn is-success"
                    onClick={() => this.uploadImage2()}
                  >
                    <span style={{ color: "white" }}> Upload</span>
                  </this.ProfileButton>
                  <this.ProfileButton
                    className="nes-btn is-warning"
                    onClick={() => this.uploadImage1()}
                  >
                    이미지 변경취소
                  </this.ProfileButton>
                </div>
              )}
            </div>
            <div>
              <hr className="hr-green" />
              <div>
                {!nickBtn && nickname ? (
                  <div>
                    <div>
                      <span className="span_em_default">
                        닉네임: {nickname}
                      </span>
                    </div>
                    <this.ProfileButton
                      className="nes-btn is-primary"
                      onClick={() => this.changeNick1()}
                    >
                      닉네임 변경
                    </this.ProfileButton>
                  </div>
                ) : !nickBtn && !nickname ? (
                  <div>
                    {this.props.email}님의 닉네임이 없습니다.
                    <this.ProfileButton
                      className="nes-btn is-primary"
                      onClick={() => this.changeNick1()}
                    >
                      닉네임 등록
                    </this.ProfileButton>
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
                    <this.ProfileButton
                      className="nes-btn is-warning"
                      onClick={() => this.changeNick2()}
                    >
                      변경 적용
                    </this.ProfileButton>
                  </div>
                )}
              </div>
              <hr className="hr-green" id="#self" />
              <a href="#self" className="nes-badge is-splited">
                <span className="is-dark">정답률</span>
                <span className="is-success">
                  {Math.floor((answerCount / totalProblemCount) * 100)}%
                </span>
              </a>

              <div>
                {totalProblemCount}문제 중 {answerCount}문제를 맞히셨습니다.
              </div>
              <hr className="hr-green" />
              <span className="span_em_default">
                <p style={{ marginBottom: 0 }}>My Tier</p>
              </span>
              <span className="span_em_default">{tier}</span>
            </div>
            <hr className="hr-green" />
            <div>
              <Link
                to={{
                  pathname: "/mySolved",
                  state: {
                    userInfo: this.state.userInfo
                  }
                }}
              >
                <this.ProfileButton
                  className="nes-btn"
                  style={{ width: "40%" }}
                >
                  <span className="span_em_small">풀었던 문제들</span>
                </this.ProfileButton>
              </Link>
              <Link
                to={{
                  pathname: "/myProblem",
                  state: {
                    userInfo: this.state.userInfo
                  }
                }}
              >
                <this.ProfileButton
                  className="nes-btn"
                  style={{ width: "40%" }}
                >
                  <span className="span_em_small">만든문제들</span>
                </this.ProfileButton>
              </Link>
            </div>
            <hr className="hr-green" />
            <GoogleLogout
              style={{ border: "4px" }}
              clientId={process.env.REACT_APP_Google}
              buttonText=" Logout"
              onLogoutSuccess={this.logout}
            />
            <div style={{ padding: "0.5em" }} />
            <hr className="hr-green" />
            <div className="flex">
              <Collapse
                accordion
                onChange={callback}
                className="filling_parent"
              >
                <Panel
                  className="nes-container padding-zero"
                  header=" FAQ"
                  key="
                        1"
                >
                  <p>사용방법</p>
                  <p>
                    기본적으로 로그인이 필요하고 편하게 구글로그인 하시면 됩니당
                  </p>
                  <p> 문제 만드는법</p>
                  <p>1.로그인</p>
                  <p>2.만들기</p>
                  <p>
                    3.문제에 필요한 파일(사진,오디오,동영상)을 업로드 후 문제
                    작성
                  </p>
                  <p>
                    4.보기는 주관식과 2지선다부터 5지선다까지 있다. 원하는 걸
                    골라서 만들면 된다.
                  </p>
                  <p>
                    5.문제를 작성했으면 다음문제 버튼을 눌러 다음 문제를
                    작성한다. 이때 다음문제 버튼을 누르면 자동으로 저장이 된다.
                  </p>
                  <p>
                    6.수정을 원하면 이전문제 버튼을 누르고 수정을 하면된다.
                    수정을 반영하려면 저장버튼을 꼭 누른다.
                  </p>
                  <p>
                    7.현재 작성중인 문제를 반영하려면 저장을 누른후 제출한다.
                    저장을 누르지 않고 작성도중에 제출하면 작성중인 문제는
                    저장되지 않는다.
                  </p>
                  <p>
                    8.작성한 문제를 확인하고 완료를 누르면 문제지 작성이
                    완료된다. 수정을 원하면 수정버튼을 눌르고 수정을 한다.
                    이때도 수정한 문제는 저장버튼을 눌러준다.
                  </p>

                  <p>문제 푸는법</p>
                  <p>1. 로그인</p>
                  <p>2. 문제 클릭</p>
                  <p>
                    3. 해당 문제를 푼다. 객관식의 경우 답이 여러개일 수 있다.
                  </p>
                  <p>
                    4. 모두 풀고 제출하면 채점후 결과가 나오는데 난이도와 문제
                    퀄리티 두종류의 평점을 을 매기고 코멘트를 달 수 있다.
                  </p>
                </Panel>
                <Panel
                  header="문의"
                  key="2"
                  className="nes-container padding-zero"
                >
                  <p>문의사항: duckhoogosa@gmail.com</p>
                  <span className="span_em_default">
                    어떤 문의사항이든 소중하게 받아들이는 The KOO되겠습니다.
                  </span>
                </Panel>
                <Panel
                  header="문제가 업로드 되지 않을떄"
                  key="3"
                  className="nes-container padding-zero"
                >
                  <p>문제가 업로드 되지않을땐?</p>
                  <span className="span_em_default">
                    PROFILE > LOGOUT 후 다시 로그인해주세요! 현재 서비스에
                    문제가 있어 수정중입니다.
                  </span>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default Profile;
