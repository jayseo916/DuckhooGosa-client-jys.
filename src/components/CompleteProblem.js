import React from "react";
import AWS from "aws-sdk";
import { Link } from "react-router-dom";
import {
  FilePond,
  File,
  registerPlugin,
  create,
  setOptions
} from "react-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import "filepond/dist/filepond.min.css";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import axios from "axios";
import { UploadToS3 } from "../client/upLoad";
import { nullLiteral } from "@babel/types";
let endPoint = "http://localhost:8000/problem";
// Register the plugin
registerPlugin(
  FilePondPluginFilePoster,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileEncode
);

const albumBucketName = "duckhoogosa";
const bucketRegion = "ap-northeast-2";
const IdentityPoolId = "ap-northeast-2:ba805140-83ec-4793-8736-0641dd7d6f71";

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

    this.setState({
      allFiles: Problems
    });
  }

  handleInit = () => {};
  modifyProblem = () => {
    console.log("hi");
    this.props.changeComplete();
  };
  uploadAndGetLink = dir => {
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
        return null;
      }
    });

    Promise.all(promise)
      .then(v => {
        let problems = this.props.Problems.map((problem, num) => {
          problem.fileLink1 = promise[num];
          return problem;
        });

        const {
          email,
          tags,
          genre,
          title,
          date,
          representImg,
          background
        } = this.props;

        let obj = {
          email: email,
          tags: tags,
          genre: genre,
          title: title,
          date: date,
          representImg: representImg,
          background: background,
          problems: problems
        };
        // await axios.post("http://localhost:8000/problem", obj).catch(err => {
        //   console.log(err);
        // });

        console.log("보내는 객체", obj);
      })
      .catch(ex => {
        console.error(ex);
      });
  };
  postProblems = async () => {
    this.uploadAndGetLink("file1");
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
        ></FilePond>
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
        </div>
      );
    });

    return problems;
  };

  render() {
    const problems = this.loadProblems();

    return (
      <React.Fragment>
        {problems}
        <div
          className="btn-group btn-group-lg"
          role="group"
          aria-label="Basic example"
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              this.modifyProblem();
            }}
          >
            수정
          </button>

          <Link
            to="problem/main"
            type="reset"
            className="btn btn-primary"
            onClick={() => {
              this.postProblems();
            }}
          >
            완료
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default CompleteProblem;