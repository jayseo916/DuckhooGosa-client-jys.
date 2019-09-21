import React from "react";

function CompleteProblem(Problems) {
  //제출 = Problems 를 이용하여 쭉 출력 => 완료버튼 : POST 하고 main으로 이동
  //수정 = ViewProblems 를 이용하여 마지막 문제로 이동

  let problems = Problems.map((problem, num) => {
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
          {num + 1}번 문제: {problem.problemText}
        </div>
        <div>{choices}</div>
      </div>
    );
  });

  return problems;
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
