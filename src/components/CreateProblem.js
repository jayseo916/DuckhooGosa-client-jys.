import React, { Component } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import Joi from "joi-browser";
import CompleteProblem from "./CompleteProblem";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.css";
import styled from "styled-components";
import { Popover } from "antd";
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageEdit,
  FilePondPluginImageResize,
  FilePondPluginImageCrop,
  FilePondPluginImageTransform
);
let isDev = process.env.REACT_APP_LOG;

class CreateProblem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      email: this.props.email,
      tags: null,
      genre: localStorage.getItem("genre"),
      title: localStorage.getItem("title"),
      date: new Date(),
      Problems: [], //문제 객체의 목록
      problemText: "", //현재 문제의 지문
      errors: {},
      complete: false,
      choiceInitialValue: "none",
      choice: [], //문제객체 배열  => {text:,answer:} 객체 저장
      curProblem: 0, //현재 문제 번호 0~,
      subjectAnswer: "",
      popVisible: false
    };
    this.BottomButton = styled.button`
      padding: 1px;
    `;
  }

  componentDidMount() {
    isDev && console.log(this.props);
  }
  handleInit() {
    isDev && console.log("FilePond instance has initialised", this.pond);
  }

  state = {
    popVisible: false
  };

  hide = () => {
    this.setState({
      vpopVisible: false
    });
  };

  handleVisibleChange = popVisible => {
    this.setState({ popVisible });
  };

  handleChange = e => {
    //문제의 지문 값 온체인지

    let problemText = e.target.value;
    this.setState(
      {
        problemText
      },
      () => {
        const errors = { ...this.state.errors };
        const errMsg = this.validate();
        if (errMsg) errors.problemText = errMsg.problemText;
        else delete errors.problemText;
        this.setState({
          errors
        });
      }
    );
    isDev && console.log(this.state.problemText);
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
    answer[v].answer = answer[v].answer.trim();
    this.setState({
      choice: answer
    });
  };

  handleChoiceAnswer = (e, v) => {
    //답안지 별 텍스트 수정

    let answer = [...this.state.choice];
    if (e.target.type === "checkbox") {
      answer[v].answer = !answer[v].answer;
      this.setState({
        choice: answer
      });
    } else if (e.target.type === "textarea" && answer.length === 1) {
      answer[v].answer = e.target.value;
      let arr = answer[v].answer.split("");
      let temp = arr.filter(v => {
        if (v !== " ") {
          return v;
        }
      });
      answer[v].answer = temp.join("");

      this.setState(
        {
          choice: answer,
          subjectAnswer: e.target.value
        },
        () => {
          isDev && console.log("주관답", this.state.choice[0].answer);
          isDev && console.log("프라블럼스의 답", this.state.Problems);
          isDev && console.log(this.state.subjectAnswer);
          const errors = { ...this.state.errors };
          const errMsg = this.validateChoice();
          isDev && console.log("주관식?", errMsg);
          if (errMsg) errors[v] = errMsg[v];
          else delete errors[v];

          isDev && console.log(errors);
          isDev && console.log("번호", v);
          this.setState({
            errors
          });
        }
      );
    } else {
      answer[v].text = e.target.value;
      this.setState(
        {
          choice: answer
        },
        () => {
          const errors = { ...this.state.errors };
          const errMsg = this.validateChoice();
          if (errMsg) errors[v] = errMsg[v];
          else delete errors[v];
          isDev && console.log("choice배열", this.state.choice);
          isDev && console.log("문제배열", this.state.Problems.choice);
          this.setState({
            errors
          });
        }
      );
    }
  };

  choiceHandleChange = e => {
    //보기 타입 설정
    this.setState({
      chiceValue: e.target.value
    });
  };

  formTag = (num, label) => {
    //중복되는 태그 답안별로 체크해서 띄우기

    return (
      <React.Fragment>
        <div className="form-group center-parent flex fdr margin-side_03em">
          <label htmlFor="choiceName" className="margin-center-vertical">
            {this.state.choice[1] === undefined ? "주관식정답" : label}
          </label>
          <span className="flex margin-side_03em" style={{ width: "100%" }}>
            <textarea
              // style={{ width: "60%" }}
              id="choiceName"
              onChange={e => {
                this.handleChoiceAnswer(e, num);
              }}
              type="text"
              className="form-control flex"
              defaultValue={
                this.state.choice.length === 1 &&
                this.state.choice[0].answer !== false
                  ? this.state.choice[num].answer
                  : this.state.choice[num].text
              }
            />
          </span>
          {/*{"                 "}*/}
          {this.state.choice[1] === undefined ? null : (
            <div className="checkBOX margin-center-vertical">
              <span className="span_em_small"> 정답:</span>
              <input
                style={{
                  MsTransform: "scale(2)",
                  MozTransform: "scale(2)",
                  WebkitTransform: "scale(2)",
                  OTransform: "scale(2)",
                  transform: "scale(2)",
                  margin: "0.5em 1.2em 0",
                  display: "inline-flex"
                }}
                type="checkbox"
                defaultChecked={this.state.choice[num].answer}
                onChange={e => {
                  this.handleChoiceAnswer(e, num);
                }}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  selectHandleChange = event => {
    //답안 타입 선택
    let errors = {};
    if (this.state.errors.problemText) {
      errors.problemText = this.state.errors.problemText;
    }
    let type = parseInt(event.target.value);
    let arr = [];
    for (let i = 0; i < type; i++) {
      arr.push({ text: "", answer: false });
    }
    this.setState({
      choice: arr,
      errors
    });
  };

  viewProblem = (ProblemNum, dis) => {
    if (ProblemNum < 0 && dis !== 1) {
      //0번문제 에서 왼쪽으로 이동 못하게
      alert("이전 문제가 없습니다");
      return;
    }
    if (!this.state.Problems[ProblemNum]) {
      //새로운 문제를 생성하는 경우
      if (this.state.choice.length === 0) {
        alert("답안 유형을 선택해야 합니다");
        return;
      }
      let check = 0;

      for (let i = 0; i < this.state.choice.length; i++) {
        if (this.state.choice[i].answer === true) check++;
      }

      if (this.state.choice.length !== 1 && check === 0) {
        alert("한개 이상의 정답이 있어야 합니다");
        return;
      }

      const errorsOne = this.validate();
      const errorsTwo = this.validateChoice();
      let errors = {};
      if (errorsOne) {
        errors = { ...errorsOne };
      }
      if (errorsTwo) {
        errors = { ...errors, ...errorsTwo };
      }
      isDev && console.log("hi", errors, Object.keys(errors).length);
      this.setState({ errors: errors });

      if (Object.keys(errors).length !== 0) {
        isDev && console.log(errors);
        return;
      }
      /////////

      let newProblem = {
        fileLink1: (this.state.files && this.state.files[0]) || null,
        subjectAnswer:
          this.state.choice.length === 1 ? this.state.subjectAnswer : "",
        problemText: this.state.problemText,
        choice: this.state.choice
      };
      isDev && console.log("viewProblem 발동", newProblem);
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
      this.setState({
        problemText: curProblemSet.problemText,
        choiceInitialValue: "none",
        choice: [...curProblemSet.choice],
        curProblem: ProblemNum,
        files: files
      });
      isDev && console.log("viewProblem밑에꺼 발동", this.state.Problems);
    }
  };

  validate = () => {
    const errors = {};

    const { problemText } = this.state;

    if (problemText.trim() === "") {
      errors.problemText = "지문을 적어야 합니다.";
    } else if (problemText.length > process.env.REACT_APP_Q) {
      errors.problemText = `${process.env.REACT_APP_Q}자 이하로 적어주세요`;
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  validateChoice = () => {
    const errors = {};
    const { choice } = this.state;
    if (choice.length === 1) {
      isDev && console.log("??", choice);
      if (choice[0].answer === false || choice[0].answer.trim() === "") {
        errors[0] = `주관식 답변을 작성해주세요`;
      } else if (choice[0].answer.length > process.env.REACT_APP_NARRATIVE) {
        errors[0] = `${process.env.REACT_APP_NARRATIVE}자 이하로 적어주세요`;
      }
    } else {
      for (let i = 0; i < choice.length; i++) {
        if (choice[i].text.trim() === "") {
          errors[i] = `${i + 1}번 보기를 채워주세요`;
        } else if (choice[i].text.length > process.env.REACT_APP_CHOICE) {
          errors[i] = `${process.env.REACT_APP_CHOICE}자 이하로 적어주세요`;
        }
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  saveProblem = () => {
    if (this.state.choice.length === 0) {
      alert("답안 유형을 선택해야 합니다");
      return;
    }
    let check = 0;

    for (let i = 0; i < this.state.choice.length; i++) {
      if (this.state.choice[i].answer === true) check++;
    }

    if (this.state.choice.length !== 1 && check === 0) {
      alert("한개 이상의 정답이 있어야 합니다");
      return;
    }

    const errorsOne = this.validate();
    const errorsTwo = this.validateChoice();
    let errors = {};
    if (errorsOne) {
      errors = { ...errorsOne };
    }
    if (errorsTwo) {
      errors = { ...errors, ...errorsTwo };
    }
    isDev && console.log("hi", errors, Object.keys(errors).length);
    this.setState({ errors: errors });

    if (Object.keys(errors).length !== 0) {
      isDev && console.log(errors);
      return;
    }
    /////////
    isDev && console.log("저장중 ^^");
    let newProblem = {
      fileLink1: (this.state.files && this.state.files[0]) || null,
      subjectAnswer:
        this.state.choice.length === 1 ? this.state.subjectAnswer : "",
      problemText: this.state.problemText,
      choice: [...this.state.choice]
    };
    let Problems = [...this.state.Problems];
    Problems[this.state.curProblem] = newProblem;
    this.setState(
      {
        Problems
      },
      () => {
        isDev && console.log(this.state.Problems,"현재 프로블럼 객체 상태 ")
      }
    );

    alert("저장완료");
  };

  viewFunction = a => {
    this.viewProblem(this.state.curProblem + a);
  };
  //컴플릿 프로블럼 1. 완료스테이트를 추가하여 렌더링한다. 2. Problems를 인자로 받아 화면에 출력 3.수정 버튼 클릭시 마지막 문제로 돌아감

  changeComplete = () => {
    this.setState({
      complete: false
    });
  };
  completeFun = Problems => {
    if (this.state.curProblem !== this.state.Problems.length) {
      isDev && console.log(this.state.curProblem, this.state.Problems);
      if (this.state.choice.length === 0) {
        alert("답안 유형을 선택해야 합니다");
        return;
      }
      let check = 0;

      for (let i = 0; i < this.state.choice.length; i++) {
        if (this.state.choice[i].answer === true) check++;
      }

      if (this.state.choice.length !== 1 && check === 0) {
        alert("한개 이상의 정답이 있어야 합니다");
        return;
      }

      const errorsOne = this.validate();
      const errorsTwo = this.validateChoice();
      let errors = {};
      if (errorsOne) {
        errors = { ...errorsOne };
      }
      if (errorsTwo) {
        errors = { ...errors, ...errorsTwo };
      }
      isDev && console.log("hi", errors, Object.keys(errors).length);
      this.setState({ errors: errors });

      if (Object.keys(errors).length !== 0) {
        isDev && console.log(errors);
        return;
      }
    }
    ////////////////
    if (Problems.length === 0) {
      alert("제출할 문제가 없습니다");
      return;
    }

    // let allFiles = Problems.map(v => v.fileLink1);
    this.setState({ complete: true });
  };
  render() {
    return this.state.complete === false ? (
      <div
        className="max-width pageCSS-white"
        style={{
          overflow: "auto",
          width: "100%",
          height: "100%",
          paddingTop: "1em",
          paddingBottom: "5em"
        }}
      >
        <form style={{ marginBottom: "45px" }}>
          <label
            className="flex-container-row center-parent"
            style={{
              marginLeft: "0.5em",
              marginRight: "0.5em",
              marginBottom: "0.5em"
            }}
          >
            <span className="span_em_middle">
              <div className="d-inline p-2 bg-primary text-white flex">
                {this.state.curProblem + 1}번
              </div>
            </span>
            <span style={{ marginLeft: "auto" }}>
              <Popover
                // content={<a onClick={this.hide}>Close</a>}
                title="파일당 최대 2MB, 허용 확장자 jpg jpeg png mp3 mp4 avi"
                trigger="click"
                visible={this.state.popVisible}
                onVisibleChange={this.handleVisibleChange}
              >
                <button
                  type="primary"
                  className="nes-btn padding-zero flex"
                  style={{
                    marginLeft: "auto",
                    marginRight: "1em !important"
                  }}
                >
                  <span role="img" alt={"?"}>
                    {" "}
                    ❓
                  </span>
                </button>
              </Popover>
            </span>
          </label>
          <FilePond
            ref={ref => (this.pond = ref)}
            files={this.state.files ? this.state.files : []}
            allowMultiple={true}
            maxFiles={1}
            maxFileSize={"2MB"}
            labelMaxFileSize={"maximum size 2MB"}
            server={null}
            allowFileTypeValidation={true}
            acceptedFileTypes={[
              "image/png",
              "image/jpg",
              "image/jpeg",
              "audio/mp3",
              "video/mp4",
              "video/avi"
            ]}
            // onremovefile={this.removefile}
            allowImageTransform={true}
            imagePreviewHeight="300"
            imageCropAspectRatio="1:1"
            imageResizeTargetWidth="300"
            imageResizeTargetHeight="300"
            oninit={() => this.handleInit()}
            onupdatefiles={fileItems => {
              // Set current file objects to this.state

              this.setState({
                files: fileItems.map(fileItem =>
                  fileItem.file ? fileItem.file : []
                )
              });
            }}
          />
          <span className="span_em_middle"> 지문</span>

          <div
            className="form-group margin-zero-only"
            style={{ padding: "0 0.3em 0 0.3em" }}
          >
            <textarea
              onChange={this.handleChange}
              type="text"
              placeholder="질문입력"
              className="form-control"
              defaultValue={this.state.problemText}
            />
            {this.state.errors.problemText && (
              <div className="alert alert-danger">
                {this.state.errors.problemText}
              </div>
            )}
          </div>
          <div className="fdr flex center-parent">
            {/*<label htmlFor="default_select">답안지 선택 </label>*/}
            <div
              className="nes-select flex-fixer"
              style={{
                maxWidth: "150px",
                height: "2em"
              }}
            >
              <select
                className="padding-zero-only"
                required
                id="default_select"
                value={this.state.choiceInitialValue}
                onChange={this.selectHandleChange}
              >
                <option value="none">유형선택</option>
                <option value="1">주관식</option>
                <option value="2">보기 두개</option>
                <option value="3">보기 세개</option>
                <option value="4">보기 네개</option>
                <option value="5">보기 다섯개</option>
              </select>
            </div>
          </div>
          <div>
            {this.state.choice[0] && this.formTag(0, "1번")}
            {this.state.errors[0] && (
              <div className="alert alert-danger">{this.state.errors[0]}</div>
            )}
            {this.state.choice[1] && this.formTag(1, "2번")}
            {this.state.errors[1] && (
              <div className="alert alert-danger">{this.state.errors[1]}</div>
            )}
            {this.state.choice[2] && this.formTag(2, "3번")}
            {this.state.errors[2] && (
              <div className="alert alert-danger">{this.state.errors[2]}</div>
            )}
            {this.state.choice[3] && this.formTag(3, "4번")}
            {this.state.errors[3] && (
              <div className="alert alert-danger">{this.state.errors[3]}</div>
            )}
            {this.state.choice[4] && this.formTag(4, "5번")}
            {this.state.errors[4] && (
              <div className="alert alert-danger">{this.state.errors[4]}</div>
            )}
          </div>
          <div
            style={{ overflow: "hidden", marginTop: "1em" }}
            className="btn-group btn-group-lg"
            role="group"
            aria-label="Basic example"
          >
            <span className="span_em_small">
              <this.BottomButton
                type="button"
                className="nes-btn is-primary"
                onClick={() => {
                  this.completeFun(this.state.Problems);
                }}
              >
                SUBMIT
              </this.BottomButton>
              <this.BottomButton
                type="button"
                className="nes-btn is-error"
                onClick={this.removeProblem}
              >
                DELETE
              </this.BottomButton>
              <button
                type="button"
                className="nes-btn is-success"
                onClick={this.saveProblem}
              >
                SAVE
              </button>
              <this.BottomButton
                type="reset"
                className="nes-btn"
                onClick={() => {
                  this.viewFunction(-1);
                }}
              >
                PREV
              </this.BottomButton>
              <this.BottomButton
                type="reset"
                className="nes-btn"
                onClick={() => {
                  this.viewFunction(1);
                }}
              >
                NEXT
              </this.BottomButton>
            </span>
          </div>
        </form>
      </div>
    ) : (
      <CompleteProblem
        history={this.props.history}
        className="max-width"
        Problems={this.state.Problems}
        problemState={this.state}
        changeComplete={this.changeComplete}
        repreImg={this.props.repreImg}
      />
    );
  }
}

export default CreateProblem;
