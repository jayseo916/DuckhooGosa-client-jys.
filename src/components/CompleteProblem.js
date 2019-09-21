import React from "react";
import { FilePond, File, registerPlugin } from "react-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";

// Register the plugin
registerPlugin(
  FilePondPluginFilePoster,
  FilePondPluginImagePreview,
  FilePondPluginMediaPreview
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

  handleInit = () => {};

  render() {
    console.log("프롭스파일", this.props.imgs);
    let Problems = this.props.Problems;

    let imgs = Problems.map(problem => {
      return problem.fileLink1 ? problem.fileLink1 : [];
    });

    let problems = Problems.map((problem, num) => {
      let curFile = (
        <FilePond
          ref={ref => (this.pond = ref)}
          files={problem.fileLink1 ? [problem.fileLink1] : undefined}
          disabled="true"
          allowMultiple={true}
          maxFiles={31}
          labelldle=""
          server={null}
          // onremovefile={this.removefile}
          oninit={() => this.handleInit()}
        ></FilePond>
      );

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
  }
}

export default CompleteProblem;

// Problems:
//       [
//         {
//           "type": String,
//           "fileLink1": String,
//           "fileLink2": String,
//           "problemText": String,
//           "choice": [
//             {
//               "text": String,
//               "answer": Boolean    //주관식인 경우에 불리언이 아니고 주관식의 답변인 string 저장
//             }
//           ]
//         }
//       ],
