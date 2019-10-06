import React from "react";
import styled from "styled-components";
import Img from "react-image";

class SelectTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      URL: null
    };
    this.MainConatiner = styled.div`
      flex-direction: column;
      width: 100%;
      justify-content: center;
      align-items: center;
      padding: 3em 0 7em;
    `;
    this.ImgInput = styled.input`
      min-width: 300px;
      width: 70%;
    `;
    this.TxtInput = styled.input`
      min-width: 300px;
      width: 70%;
    `;
  }
  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }
  fileUpload(e) {
    this.setState({
      URL: URL.createObjectURL(e.target.files[0])
    });
    this.props.setRepreImg(e.target.files[0]);
    let fileEl = document.getElementById("inputFile1");
    console.log(fileEl);
  }
  clickHandler() {
    if (this.state.title === "") {
      alert("문제 제목을 적어주세요");
    } else {
      localStorage.setItem("title", this.state.title);
      this.props.history.push("/createProblem");
    }
  }
  render() {
    const repreImg = this.state.URL;
    return (
      <this.MainConatiner className="pageCSS-green max-width center-parent">
        <div
          className="nes-con tainer with-title is-centered is-rounded"
          style={{
            height: "100%"
          }}
        >
          <p className="title title-hotpink font-2P">Title Setting</p>

          <div className="titleBox flex flex">
            <span className="span_em_middle">
              {" "}
              현재 장르: {localStorage.getItem("genre")}
            </span>
          </div>
          <this.TxtInput
            type="text"
            placeholder="문제 제목을 입력해주세요"
            onChange={e => this.handleTitleChange(e)}
          />
          <div> 문제를 대표할 이미지 선택(필수 X )</div>
          <this.ImgInput
            id="inputFile1"
            type="file"
            name="files[]"
            placeholder="파일을 선택해주세요"
            onChange={e => this.fileUpload(e)}
          />
          {repreImg ? (
            <div>
              <img src={repreImg} alt="대표이미지" height="200" width="300" />
            </div>
          ) : (
            <span> 이미지 없음 </span>
          )}
          <div style={{}}></div>

          <button
            className="nes-btn BottomBox"
            onClick={() => this.clickHandler()}
          >
            문제 제작하기
          </button>
        </div>
      </this.MainConatiner>
    );
  }
}
export default SelectTheme;
