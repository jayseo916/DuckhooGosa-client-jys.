import React, { Component } from "react";
import axios from "axios";
import Img from "react-image";
import { config } from "../config";
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
      const data = await axios
        .get(`http://localhost:8000/problem/${this.state.problem_id}`, config)
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
        console.log("보내는 답", obj);
        console.log("보내는 답", JSON.stringify(obj));
        axios
          .post("http://localhost:8000/problem/solution", obj, config)
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
                <VolumeMenuButton disabled />
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
            <span>답</span>
            <textarea
              style={{
                outlineColor: "black",
                height: "40px",
                width: "280px",
                position: "relative",
                top: "13px",
                left: "10px"
              }}
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
            <div key={choiceNum} className="nes-container is-rounded">
              {/* <button
                type="button"
                className="nes-text is-primary"
                style={{ padding: "0 0 0 0", margin: "0 0 0 0" }}
                onClick={e => {
                  this.handleChoice(e, num, choiceNum);
                }}
              > */}
              {/* </button> */}
              <span>
                {choiceNum + 1}번.{v.text}
              </span>
              <input
                type="checkbox"
                onChange={e => {
                  this.handleChoice(e, num, choiceNum);
                }}
              />
              <span>정답</span>
            </div>
          );
        });
      }
      /////////////////
      return (
        <div
          key={num}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "0 0 80px 0"
          }}
        >
          <h3>{num + 1}번 </h3>
          {fileTag}
          <h4 style={{ padding: "0 0 20px 0" }}>문제:{problem.problemText}</h4>
          <h5>{viewChoice}</h5>
        </div>
      );
      ////////////////
    });

    return view;
  };

  render() {
    return !this.state.isLoading ? (
      <div>
        <progress
          className="nes-progress is-success"
          value={this.state.progress}
          max="100"
        />
      </div>
    ) : (
      <div>
        {this.state.scoring === false ? (
          <React.Fragment>
            {this.viewProblem()}
            <label style={{ padding: "0 0 40px 0" }}>
              남은문제 {this.state.total - this.state.solved} /{" "}
              {this.state.total}
            </label>
            <button
              type="button"
              className="nes-btn is-success"
              onClick={this.submit}
              style={{ marginLeft: "50px" }}
            >
              제출
            </button>
          </React.Fragment>
        ) : (
          <Scoring
            data={{
              okCount: this.state.resultData.okCount,
              tryCount: this.state.resultData.tryCount,
              commentCount: this.state.resultData.commentCount,
              problem_id: this.state.problem_id,
              checkProblem: this.state.resultData.checkProblem,
              totalProblem: this.state.resultData.totalProblem,
              email: this.state.email
            }}
            history={this.props.history}
          /> //페이크 데이타 넘김
        )}
      </div>
    );
  }
}
