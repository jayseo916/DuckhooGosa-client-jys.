import React from "react";

class SelectGenre extends React.Component {
  genreSubmit(paramGenre) {
    localStorage.setItem("genre", paramGenre);
    this.props.history.push("/selectTheme"); // 테마선택하는 페이지로 넘기기
  }
  render() {
    return (
      <div className="select-genre">
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/movieSet.jpeg"
          alt="영화"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("movie")}
        />
        영화
        <br></br>
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/movieSet.jpeg"
          alt="애니메이션"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("animation")}
        />
        애니메이션
        <br></br>
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/gamePad.png"
          alt="게임"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("game")}
        />
        게임
        <br></br>
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/movieSet.jpeg"
          alt="연예"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("entertain")}
        />
        연예
        <br></br>
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/military.png"
          alt="군사"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("military")}
        />
        군사
        <br></br>
        <img
          src="https://duckhoogosa.s3.ap-northeast-2.amazonaws.com/problem_1/sports+balls.jpg"
          alt="스포츠"
          height="10%"
          width="20%"
          onClick={() => this.genreSubmit("sports")}
        />
        스포츠
      </div>
    );
  }
}
export default SelectGenre;
