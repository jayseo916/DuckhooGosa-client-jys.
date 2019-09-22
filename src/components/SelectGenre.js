import React from "react";

class SelectGenre extends React.Component {
  genreSubmit(paramGenre) {
    localStorage.setItem("genre", paramGenre);
    this.props.history.push("/SelectTheme"); // 테마선택하는 페이지로 넘기기
  }
  render() {
    return (
      <div className="select-genre">
        <img
          src="1.jpg"
          alt="영화"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("movie")}
        />
        <br></br>
        <img
          src="2.jpg"
          alt="애니메이션"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("animation")}
        />
        <br></br>
        <img
          src="3.jpg"
          alt="게임"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("game")}
        />
        <br></br>
        <img
          src="4.jpg"
          alt="연예"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("entertain")}
        />
        <br></br>
        <img
          src="5.jpg"
          alt="군사"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("military")}
        />
        <br></br>
        <img
          src="6.jpg"
          alt="스포츠"
          height="40"
          sizes="100"
          onClick={() => this.genreSubmit("sports")}
        />
      </div>
    );
  }
}
export default SelectGenre;
