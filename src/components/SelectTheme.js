import React from "react";
import Img from "react-image";
import "../shared/App.css";

class SelectTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      URL: null
    };
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
      <div className="max-width center-series pageCSS-white fdc filling_parent">
        <div
          className="nes-container nes-container-normal with-title is-centered margin-center filling_parent"
          style={{
            "flex-wrap": "wrap",
            "padding-bottom": "3em"
          }}
        >
          <p className="title font-2P">
            <span className="title span_em_middle">Title INFO</span>
          </p>

          <div className="titleBox flex center-flex-container">
            <span className="span_em_middle margin-center">
              {" "}
              현재 장르: {localStorage.getItem("genre")}
            </span>
          </div>
          <hr className="hr-green" />
          <div
            className="flex fdr"
            style={{
              maxHeight: "2em"
            }}
          >
            <span className="span_em_middle inline-flex">제목:</span>
            <input
              className="flex"
              type="text"
              placeholder="문제 제목을 입력해주세요"
              onChange={e => this.handleTitleChange(e)}
            />
          </div>
          <hr className="hr-green" />
          <div>
            <span className="span_em_small">대표 이미지 선택 (필수 X)</span>
          </div>
          {repreImg ? (
            <div>
              <img src={repreImg} alt="대표이미지" height="200" width="300" />
            </div>
          ) : (
            <div>
              <span> 이미지 없음 </span>
            </div>
          )}
          <div className="filebox">
            <label
              htmlFor="inputFile1"
              className="label-input"
              // style={{
              //   border: "5px"
              // }}
            >
              업로드
            </label>
            <input
              id="inputFile1"
              type="file"
              hidden="true"
              // placeholder="파일을 선택해주세요"
              onChange={e => this.fileUpload(e)}
            />
          </div>
          <hr className="hr-green" />
          <div
            className="BottomBox flex center-parent"
            style={{
              width: "fit-contents"
            }}
          >
            <button
              className="nes-btn BottomBox "
              onClick={() => this.clickHandler()}
            >
              문제만들기
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default SelectTheme;
