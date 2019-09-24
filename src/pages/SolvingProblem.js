import React, { Component } from "react";
import axios from "axios";
import Img from "react-image";
import { problems } from "./fake";
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
      problemId: this.props.match.params.id,
      titleImg: "",
      backImg: "",
      problems: problems,
      answer: [],
      nickname: "",
      email: "",
      solved: 0,
      total: problems.length //
    };
  }

  componentDidMount() {
    // this.loadProblem();
  }

  loadProblem = async () => {
    try {
      const problem = await axios.get(
        `http://localhost:8000/problem/${this.state.problemId}`
      );
      this.setState({
        titleImg: problem.img,
        backImg: problem.title,
        problems: problem.problems,
        total: problems.problems.length //추후 실제데이터 시 사용
      });
    } catch (ex) {
      console.error(ex);
    }
  };

  submit = async () => {
    // const { nickname, answer, problemId, email } = this.state;
    // let obj = { nickname, answer, problemId, email };
    // try {
    //   const { data } = await axios.post(
    //     "http://localhost:8000/problem/solution",
    //     obj
    //   );
    //   /////data 가지고 이제 처리하믄 뎀
    // } catch (ex) {
    //   console.error(ex);
    // }
  };

  handleChoice = (e, num, choiceNum) => {
    if (e.target.type !== "checkbox") {
      //주관식인경우
      let answer = [...this.state.answer];
      answer[num] = e.target.value;
      this.setState({
        answer
      });
    } else {
      let answer = [...this.state.answer];
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
      this.setState({ answer }, () => {
        let solved = 0;
        this.state.answer.forEach(v => {
          if (v && v.length !== 0) {
            solved++;
          }
        });
        this.setState({
          solved
        });
      }); ///////////////done

      // console.log("답안지", this.state.answer);
    }
  };
  viewProblem = () => {
    // const { problems } = this.state.problems;
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
            <div key={choiceNum}>
              <label>
                {choiceNum + 1}번. {v.text}
              </label>
              <input
                type="checkbox"
                onChange={e => {
                  this.handleChoice(e, num, choiceNum);
                }}
              />
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
    console.log("total:", this.state.total);
    console.log("solved:", this.state.solved);
    console.log("답안", this.state.answer);

    return (
      <div>
        {this.viewProblem()}
        <label style={{ padding: "0 0 40px 0" }}>
          남은문제 {this.state.total - this.state.solved} / {this.state.total}
        </label>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={this.submit}
          style={{ marginLeft: "50px" }}
        >
          제출
        </button>
      </div>
    );
  }
}
