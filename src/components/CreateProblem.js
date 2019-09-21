import React, { Component } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Joi from "joi-browser";
import CompleteProblem from "./CompleteProblem";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class CreateProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      _id: String,
      email: String,
      tags: Array,
      Genre: String,
      title: String,
      date: new Date(),
      background: String,
      representImg: String,
      Problems: [], //문제 객체의 목록
      problemText: "", //현재 문제의 지문
      problemTextErrors: {},
      complete: false,
      choiceInitialValue: "none",
      choice: [], //문제객체 배열  => {text:,answer:} 객체 저장
      curProblem: 0 //현재 문제 번호 0~
    };
  }
  // problemTextSchema = {
  //   Problemtext: Joi.string().required()
  // };

  componentDidMount() {}
  handleInit() {
    console.log("FilePond instance has initialised", this.pond);
  }

  handleChange = e => {
    //문제의 지문 값 온체인지
    this.setState({
      problemText: e.target.value
    });
  };

  removeProblem = () => {
    //고려사항 1. 현재 삭제할 문제가 저장되어있지 않은 경우. 2.0번을 삭제시 오른쪽으로 이동 3. 마지막 삭제시 왼쪽으로 이동 4. 중간 삭제시 오른쪽걸 땡겨옴
    let { Problems } = this.state;
    const { curProblem } = this.state;
    if (curProblem === 0 && Problems.length === 1) {
      this.viewProblem(1, 1);
      Problems.pop();
      this.setState({
        Problems: Problems,
        curProblem: 0
      });
      return;
    }

    if (Problems[curProblem] === undefined) {
      alert("저장부터하세요");
      return;
    } else if (curProblem === Problems.length - 1) {
      this.viewProblem(curProblem - 1);
      Problems.pop();
      this.setState({ Problems });
    } else {
      this.viewProblem(curProblem + 1);
      Problems.shift();
      this.setState({ Problems });
    }
  };
  answerHandler = (e, v) => {
    //주관식 답변 저장
    let answer = [...this.state.choice];
    answer[v].answer = e.target.value;
    this.setState({
      choice: answer
    });
  };

  handleChoiceAnswer = (e, v) => {
    //답안지 별 텍스트 수정

    let answer = [...this.state.choice];
    console.log("hi", e.target.type, answer.length);
    if (e.target.type === "checkbox") {
      answer[v].answer = !answer[v].answer;
      this.setState({
        choice: answer
      });
    } else if (e.target.type === "textarea" && answer.length === 1) {
      // let answer = [...this.state.choice];

      answer[v].answer = e.target.value;
      this.setState({
        choice: answer
      });
      console.log("hi", answer);
    } else {
      // let answer = [...this.state.choice];
      answer[v].text = e.target.value;
      this.setState({
        choice: answer
      });
    }
    console.log(this.state);
  };

  choiceHandleChange = e => {
    //보기 타입 설정
    console.log(e.target.value);
    this.setState({
      chiceValue: e.target.value
    });
  };

  formTag = (num, label) => {
    //중복되는 태그 답안별로 체크해서 띄우기

    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="" className="htmlFor">
            {this.state.choice[1] === undefined ? "주관식정답" : label}
          </label>
          <span>
            <textarea
              onChange={e => {
                this.handleChoiceAnswer(e, num);
              }}
              type="text"
              className="form-control"
              defaultValue={
                this.state.choice[num].text || this.state.choice[num].answer
              } //
            />
            {"                 "}
            {this.state.choice[1] === undefined ? null : ( // /> //   defaultValue={this.state.choice[num].answer} //   className="form-control" //   type="text" //   }} //     this.answerHandler(e, num); //   onChange={e => { // <textarea //주관답 렌더
              <input
                type="checkbox"
                defaultChecked={this.state.choice[num].answer}
                onChange={e => {
                  this.handleChoiceAnswer(e, num);
                }}
              />
            )}
          </span>
        </div>
      </React.Fragment>
    );
  };

  selectHandleChange = event => {
    //답안 타입 선택

    let type = parseInt(event.target.value);
    let arr = [];
    for (let i = 0; i < type; i++) {
      arr.push([{ text: "", answer: false }]);
    }
    this.setState({
      choice: arr
    });
  };

  viewProblem = (ProblemNum, dis) => {
    if (ProblemNum < 0 && dis !== 1) {
      alert("이전 문제가 없습니다");
      return;
    }
    if (!this.state.Problems[ProblemNum]) {
      let newProblem = {
        fileLink1: (this.state.files && this.state.files[0]) || null,
        fileLink2: (this.state.files && this.state.files[1]) || null,
        problemText: this.state.problemText,
        choice: this.state.choice
      };
      let Problems = [...this.state.Problems];
      Problems[this.state.curProblem] = newProblem;
      this.setState({
        ...this.state,
        Problems: Problems,
        curProblem: ProblemNum,
        date: new Date(),
        problemText: "",
        problemTextErrors: {},
        choiceInitialValue: "none",
        choice: [],
        files: []
      });
    } else {
      let curProblemSet = { ...this.state.Problems[ProblemNum] };
      let files = [];

      if (curProblemSet.fileLink1) {
        files.push(curProblemSet.fileLink1);
      }
      if (curProblemSet.fileLink2) {
        files.push(curProblemSet.fileLink2);
      }

      this.setState({
        problemText: curProblemSet.problemText,
        choiceInitialValue: "none",
        choice: [...curProblemSet.choice],
        curProblem: ProblemNum,
        files: files
      });
    }
  };
  saveProblem = () => {
    let newProblem = {
      fileLink1: (this.state.files && this.state.files[0]) || null,
      fileLink2: (this.state.files && this.state.files[1]) || null,
      problemText: this.state.problemText,
      choice: this.state.choice
    };
    let Problems = [...this.state.Problems];
    Problems[this.state.curProblem] = newProblem;
    this.setState({
      Problems
    });
    alert("저장완료");
  };

  viewFunction = a => {
    this.viewProblem(this.state.curProblem + a);
  };
  //컴플릿 프로블럼 1. 완료스테이트를 추가하여 렌더링한다. 2. Problems를 인자로 받아 화면에 출력 3.수정 버튼 클릭시 마지막 문제로 돌아감

  complete = Problems => {
    this.setState({ complete: true });
  };
  render() {
    return this.state.complete === false ? (
      <div>
        <form>
          <label>
            <span>
              <div className="d-inline p-2 bg-primary text-white">
                {this.state.curProblem + 1}번
              </div>
            </span>
            문제에 사용할 파일{" "}
          </label>
          <FilePond
            ref={ref => (this.pond = ref)}
            files={this.state.files ? this.state.files : []}
            allowMultiple={true}
            maxFiles={2}
            server={null}
            // onremovefile={this.removefile}
            oninit={() => this.handleInit()}
            onupdatefiles={fileItems => {
              // Set current file objects to this.state

              this.setState({
                files: fileItems.map(fileItem =>
                  fileItem.file ? fileItem.file : []
                )
              });
            }}
          ></FilePond>
          <h1>지문</h1>

          <div className="form-group">
            <label htmlFor="" className="htmlFor"></label>
            <textarea
              onChange={this.handleChange}
              type="text"
              className="form-control"
              defaultValue={this.state.problemText}
            />
          </div>
          <div>
            <div>
              답안 :
              <select
                value={this.state.choiceInitialValue}
                onChange={this.selectHandleChange}
              >
                <option value="none">선택</option>
                <option value="1">주관식</option>
                <option value="2">보기 두개</option>
                <option value="3">보기 세개</option>
                <option value="4">보기 네개</option>
                <option value="5">보기 다섯개</option>
              </select>
              {this.state.choice[0] && this.formTag(0, "1번")}
              {this.state.choice[1] && this.formTag(1, "2번")}
              {this.state.choice[2] && this.formTag(2, "3번")}
              {this.state.choice[3] && this.formTag(3, "4번")}
              {this.state.choice[4] && this.formTag(4, "5번")}
            </div>
          </div>
          <div
            className="btn-group btn-group-lg"
            role="group"
            aria-label="Basic example"
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                this.complete(this.state.Problems);
              }}
            >
              제출
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.removeProblem}
            >
              삭제
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.saveProblem}
            >
              저장
            </button>
            <button
              type="reset"
              className="btn btn-secondary"
              onClick={() => {
                this.viewFunction(-1);
              }}
            >
              이전문제
            </button>
            <button
              type="reset"
              className="btn btn-secondary"
              onClick={() => {
                this.viewFunction(1);
              }}
            >
              다음문제
            </button>
          </div>
        </form>
      </div>
    ) : (
      CompleteProblem(this.state.Problems)
    );
  }
}

export default CreateProblem;
