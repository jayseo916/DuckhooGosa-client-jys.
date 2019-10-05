import React, { Component } from "react";
import Img from "react-image";
import { axiosInstance, config } from "../config";
import Scoring from "../components/Scoring";
import "../../node_modules/nes.css/css/nes.css";

import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from "video-react";
import "../../node_modules/video-react/dist/video-react.css";

export default class SolvingProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      problem_id: this.props.match.params.id,
      titleImg: null,
      problems: null,
      answer: [],
      nickname: null,
      date: new Date(),
      email: this.props.email,
      solved: 0,
      total: 0,
      scoring: false,
      progress: 50,
      resultData: undefined
    };
  }

  componentDidMount() {
    this.loadProblem();
  }

  loadProblem = async () => {
    let id = setInterval(() => {
      let nextValue = undefined;
      if (this.state.progress === 100) {
        nextValue = 0;
      } else {
        nextValue = this.state.progress + Math.floor(Math.random() * 3);
        if (nextValue > 100) {
          nextValue = 100;
        }
      }
      this.setState({ progress: nextValue });
    }, 10);

    try {
      const data = await axiosInstance
        .get(`/problem/${this.state.problem_id}`, config)
        .then(res => {
          return res.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.setState(
        {
          isLoading: true,
          titleImg: data.img,
          title: data.title,
          problems: data.problems,
          total: data.problems.length //추후 실제데이터 시 사용
        },
        () => {
          console.log(this.state, "현재 받아온 데이터");
          clearInterval(id);
        }
      );
    } catch (ex) {
      console.error(ex);
    }
  };

  submit = () => {
    this.setState(
      {
        isLoading: false
      },
      () => {
        const { nickname, answer, problem_id, email, date } = this.state;
        let obj = { nickname, answer, problem_id, email, date };
        axiosInstance
          .post("/problem/solution", obj, config)
          .then(res => {
            console.log("답리절트", res);
            return res.data;
          })
          .then(data => {
            console.log("아이디", JSON.parse(data));
            this.setState(
              {
                resultData: JSON.parse(data),
                scoring: true,
                isLoading: true
              },
              () => {
                console.log(this.state.resultData);
                console.log(this.state.scoring);
              }
            );
          })
          .catch(err => {
            console.log(err);
          });
      }
    );
  };

  handleChoice = (e, num, choiceNum) => {
    let answer = [...this.state.answer];
    if (e.target.type !== "checkbox") {
      //주관식인경우
      console.log("타입", e.target.type);
      answer[num] = e.target.value;
      this.setState({
        answer
      });
    } else {
      console.log("타입", e.target.type);
      // let answer = [...this.state.answer];
      let select = [];
      if (answer[num]) {
        select = [...answer[num]];
      }
      if (!select.includes(choiceNum)) {
        //체크가 안되어 있는 경우
        select.push(choiceNum); //체크 추가
      } else {
        //체크가 된경우
        let idx = select.indexOf(choiceNum);
        select = [
          //체크해제
          ...select.slice(0, idx),
          ...select.slice(idx + 1, select.length)
        ];
      }
      answer[num] = select;
    }
    let solved = 0;
    this.setState({ answer }, () => {
      this.state.answer.forEach(v => {
        if (v && v.length !== 0) {
          solved++;
          // console.log("실시간솔브드값", solved);
        }
        // console.log("v값", v);
      });
      this.setState({
        solved
      });
    }); ///////////////done

    // console.log("답안지", this.state.answer);
  };
  viewProblem = () => {
    const { problems } = this.state;
    let view = problems.map((problem, num) => {
      let url = problem.fileLink1 || null;
      let fileTag = null;
      if (url) {
        if (url.slice(-3) === "png" || url.slice(-3) === "jpg") {
          fileTag = <Img src={url} />;
        } else {
          fileTag = (
            <Player fluid={true}>
              <source src={url} />
              <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                <CurrentTimeDisplay order={4.1} />
                <TimeDivider order={4.2} />
                <PlaybackRateMenuButton
                  rates={[5, 2, 1, 0.5, 0.1]}
                  order={7.1}
                />
                <VolumeMenuButton />
              </ControlBar>
            </Player>
          );
        }
      }

      let choice = problem.choice;
      let viewChoice = null;
      if (choice.length === 1) {
        viewChoice = (
          <div>
            <textarea
              style={{
                height: "2em",
                width: "100%"
              }}
              className="nes-input"
              onChange={e => {
                this.handleChoice(e, num);
              }}
            />
          </div>
        );
      } else {
        viewChoice = choice.map((v, choiceNum) => {
          //v= 보기 객체 ,choiceNum = 보기의 번호
          return (
            <div
              key={choiceNum}
              style={{ "min-width": "80%", "vertical-align": "central" }}
              className="flex"
            >
              <input
                style={{
                  "-ms-transform": "scale(2)" /* IE */,
                  "-moz-transform": "scale(2)" /* FF */,
                  "-webkit-transform": "scale(2)" /* Safari and Chrome */,
                  "-o-transform": "scale(2)" /* Opera */,
                  transform: "scale(2)",
                  margin: "0 1.2em 0",
                  display: "flex"
                }}
                type="checkbox"
                onChange={e => {
                  this.handleChoice(e, num, choiceNum);
                }}
              />
              <span className="span_em_default" style={{ "word-break": "break-word" }}>
                {choiceNum + 1}번.{v.text}
              </span>
            </div>
          );
        });
        viewChoice = (
          <div
            className="nes-container is-rounded"
            style={{ "min-width": "90%" }}
          >
            {viewChoice}
          </div>
        );
      }
      /////////////////
      return (
        <div
          className="problem-container flex"
          style={{ width: "100%", display: "inline-flex" }}
        >
          <div
            className="problem-main"
            key={num}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "0 0 -1 0.5em",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <h3>{num + 1}번 </h3>
            {fileTag}
            <span
                className="span_em_middle"
              style={{ padding: "0.5em 0 0 0", "word-break": "break-word" }}
            >
              문제:{problem.problemText}
            </span>
            {viewChoice}
            <hr className="main-hr" />
          </div>
        </div>
      );
      ////////////////
    });

    return view;
  };

  render() {
    return !this.state.isLoading ? (
      <div className="pageCSS-green container center-parent">
        <progress
          className="nes-progress is-success center-item"
          value={this.state.progress}
          max="100"
        />
      </div>
    ) : (
      <div
        style={{ height: "100%" }}
        className="pageCSS-green container center-parent"
      >
        {this.state.scoring === false ? (
          // 문제집 감싸개.
          <div
            style={{
              width: "100%",
              padding: "3em"
            }}
            className="padding-zero center-flex-container flex-fixer fdc"
          >
            {this.viewProblem()}
            <label style={{ padding: "0 0 0 0" }}>
              남은문제 {this.state.total - this.state.solved} /{" "}
              {this.state.total}
            </label>
            <br />
            <button
              className="margin-center flex-fixer nes-btn is-success"
              type="button"
              style={{
                margin: "0 auto 0 auto",
                width: "15em"
              }}
              onClick={this.submit}
            >
              제출
            </button>
          </div>
        ) : (
          <Scoring
            data={{
              okCount: this.state.resultData.all_okCount,
              tryCount: this.state.resultData.all_tryCount,
              commentCount: this.state.resultData.commentCount,
              problem_id: this.state.problem_id,
              checkProblem: this.state.resultData.checkProblem,
              email: this.state.email,
              nickname: this.state.nickname,
              title: this.state.title
            }}
            history={this.props.history}
          />
        )}
      </div>
    );
  }
}
