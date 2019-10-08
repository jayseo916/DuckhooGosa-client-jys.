import React from "react";
import styled from "styled-components";

class SelectGenre extends React.Component {
  constructor(props) {
    super(props);
    this.Card = styled.div`
      display: table;
      margin-left: auto;
      horiz-align: center;
      margin-right: auto;
      vertical-align: center;
    `;
    this.GenreImg = styled.img``;
  }
  genreSubmit(paramGenre) {
    localStorage.setItem("genre", paramGenre);
    this.props.history.push("/selectTheme"); // 테마선택하는 페이지로 넘기기
  }
  render() {
    return (
      <div className="max-width center-series pageCSS-white fdc filling_parent">
        <div
          className="nes-container nes-container-normal with-title is-centered margin-center filling_parent"
          style={{
            flexWrap: "wrap",
            paddingBottom: "3em",
            marginBottom: "45px"
          }}
        >
          <p className="title font-2P">
            <span className="title span_em_middle">Select genre</span>
          </p>

          <this.Card onClick={() => this.genreSubmit("movie")}>
            <i className="nes-mario is-small" />
            <span className="span_em_middle span_v"> 영화</span>
          </this.Card>
          <this.Card onClick={() => this.genreSubmit("animation")}>
            <i className="nes-ash is-small" />
            <span className="span_em_middle span_v"> 애니메이션 </span>
          </this.Card>
          <this.Card onClick={() => this.genreSubmit("game")}>
            <i className="nes-pokeball is-small" />
            <span className="span_em_middle span_v"> 게임 </span>
          </this.Card>
          <this.Card onClick={() => this.genreSubmit("entertain")}>
            <i className="nes-bulbasaur is-small" />
            <span className="span_em_middle span_v"> 연예 </span>
          </this.Card>
          <this.Card onClick={() => this.genreSubmit("military")}>
            <i className="nes-kirby is-small" />
            <span className="span_em_middle span_v"> 군사 </span>
          </this.Card>

          <this.Card onClick={() => this.genreSubmit("sports")}>
            <i className="nes-squirtle is-small" />
            <span className="span_em_middle span_v"> 스포츠 </span>
          </this.Card>
        </div>
      </div>
    );
  }
}
export default SelectGenre;
