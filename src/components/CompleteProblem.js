import React from "react";
import { axiosInstance, config } from "../config";
import { Link } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { UploadToS3 } from "../client/upLoad";
// import { nullLiteral } from "@babel/types";

let uniqid = require("uniqid");

// Register the plugin
registerPlugin(
  FilePondPluginFilePoster,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileEncode
);

class CompleteProblem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files: []
    };
  }
  //제출 = Problems 를 이용하여 쭉 출력 => 완료버튼 : POST 하고 main으로 이동
  //수정 = ViewProblems 를 이용하여 마지막 문제로 이동

  componentDidMount() {
    let Problems = this.props.Problems;
    console.log(Problems, "물려받은 상태 확인");

    this.setState({
      allFiles: Problems
    });
  }

  handleInit = () => {};
  modifyProblem = () => {
    // console.log("hi");
    this.props.changeComplete();
  };
  uploadAndGetLink = async dir => {
    let promise = [];
    this.props.Problems.forEach((problem, num) => {
      if (problem.fileLink1) {
        promise.push(
          new Promise((resolve, reject) => {
            try {
              UploadToS3(dir, problem.fileLink1, link => {
                resolve(link);
              });
            } catch (ex) {
              reject(ex);
            }
          })
        );
      } else {
        console.log(problem);
        // return null;
      }
    });
    let representImg =
      "https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/problem!.jpg";
    if (this.props.repreImg !== null) {
      representImg = await new Promise((resolve, reject) => {
        try {
          UploadToS3(dir, this.props.repreImg, link => {
            resolve(link);
          });
        } catch (ex) {
          reject(ex);
        }
      });
    }
    Promise.all(promise)
      .then(v => {
        let problems = this.props.Problems.map((problem, num) => {
          problem.fileLink1 = v[num];
          // console.log(problem,"중간작업")
          if (problem.choice[0].answer !== undefined) {
            problem.subjectAnswer = problem.choice[0].answer;
          }
          return problem;
        });

        const { email, tags, genre, title, date } = this.props.problemState;
        let obj = {
          email: email,
          tags: tags,
          genre: genre,
          title: title,
          date: date,
          representImg: representImg,
          problems: problems
        };
        axiosInstance
          .post(`${process.env.REACT_APP_SERVER}/problem`, obj, config)
          .then(res => {
            // console.log(res, "업로드결과");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(ex => {
        console.error(ex);
      });
  };
  postProblems = async () => {
    this.uploadAndGetLink(this.props.problemState.email + uniqid("-id-"));
  };

  loadProblems = () => {
    let Problems = this.props.Problems;
    let problems = Problems.map((problem, num) => {
      let curFile = problem.fileLink1 ? (
        <FilePond
          ref={ref => (this.pond = ref)}
          files={problem.fileLink1 ? [problem.fileLink1] : undefined}
          disabled="true"
          allowMultiple={true}
          maxFiles={1}
          labelldle=""
          server={null}
          // onremovefile={this.removefile}
          oninit={() => this.handleInit()}
        />
      ) : null;

      let choices;
      if (problem.choice.length === 1) {
        choices = problem.choice.map((v, i) => {
          return (
            <div key={i}>
              <div>정답:{v.answer}</div>
            </div>
          );
        });
      } else {
        choices = problem.choice.map((v, i) => {
          return (
            <div key={i}>
              <div>
                {i + 1}번 보기: {v.text}
              </div>
              <div>정답: {v.answer === true ? "O" : "X"}</div>
            </div>
          );
        });
      }

      return (
        <div key={num}>
          <div>
            {curFile}
            {num + 1}번 문제: {problem.problemText}
          </div>
          <div>{choices}</div>
          <hr className="main-hr" />
        </div>
      );
    });

    return problems;
  };

  render() {
    const problems = this.loadProblems();

    return (
      <div
        className="max-width pageCSS-white"
        style={{
          overflow: "auto",
          width: "100%",
          height: "100%",
          "padding-top": "2em",
          "padding-left": "0.5em",
          "padding-right": "0.5em",
          "padding-bottom": "3em"
        }}
      >
        <div
          className="nes-container with-title is-centered is-rounded padding-zero flex-container-col"
          style={{
            height: "100%"
          }}
        >
          <p className="title title-hotpink font-2P"> Preview </p>
          <div
            className="fdc flex"
            style={{
              height: "100%"
            }}
          >
            {problems}
            <div
              className="flex"
              style={{
                height: "auto",
                marginTop: "auto",
                marginBottom: "auto"
              }}
            />
            <div
              className="btn-group btn-group-lg flex-fixer margin-center center-parent"
              style={{
                width: "100%",
                height: "fit-content",
                marginBottom: "1em"
              }}
              role="group"
              aria-label="Basic example"
            >
              <button
                style={{
                  maxWidth: "40%",
                  minHeight: "2em"
                }}
                type="button"
                className="nes-btn is-warning flex padding-zero-only"
                onClick={() => {
                  this.modifyProblem();
                }}
              >
                <span className="span_em_default"> 수정</span>
              </button>
              <Link
                style={{
                  maxWidth: "40%",
                  minHeight: "2em"
                }}
                to="problem/main"
                type="reset"
                className="nes-btn is-primary flex padding-zero-only"
                onClick={() => {
                  this.postProblems();
                }}
              >
                <span className="span_em_default">완료 </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompleteProblem;
