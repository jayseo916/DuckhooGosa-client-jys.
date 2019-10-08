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
      problemTextErrors: {},
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
    // console.log(this.props);
  }
  handleInit() {
    // console.log("FilePond instance has initialised", this.pond);
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
    if (e.target.type === "checkbox") {
      answer[v].answer = !answer[v].answer;
      this.setState({
        choice: answer
      });
    } else if (e.target.type === "textarea" && answer.length === 1) {
      answer[v].answer = e.target.value;
      this.setState({
        choice: answer,
        subjectAnswer: e.target.value
      });
    } else {
      answer[v].text = e.target.value;
      this.setState({
        choice: answer
      });
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

    let type = parseInt(event.target.value);
    let arr = [];
    for (let i = 0; i < type; i++) {
      arr.push({ text: "", answer: false });
    }
    this.setState({
      choice: arr
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
      let newProblem = {
        fileLink1: (this.state.files && this.state.files[0]) || null,
        subjectAnswer:
          this.state.choice.length === 1 ? this.state.subjectAnswer : "",
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
      subjectAnswer:
        this.state.choice.length === 1 ? this.state.subjectAnswer : "",
      problemText: this.state.problemText,
      choice: this.state.choice
    };
    let Problems = [...this.state.Problems];
    Problems[this.state.curProblem] = newProblem;
    this.setState(
      {
        Problems
      },
      () => {
        // console.log(this.state.Problems,"현재 프로블럼 객체 상태 ")
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
    // console.log("hi");
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
        <form>
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
            <label />
            <textarea
              onChange={this.handleChange}
              type="text"
              placeholder="질문입력"
              className="form-control"
              defaultValue={this.state.problemText}
            />
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
            {this.state.choice[1] && this.formTag(1, "2번")}
            {this.state.choice[2] && this.formTag(2, "3번")}
            {this.state.choice[3] && this.formTag(3, "4번")}
            {this.state.choice[4] && this.formTag(4, "5번")}
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
