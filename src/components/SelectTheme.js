import React from "react";
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
    let fileKind = e.target.value.lastIndexOf(".");
    let fileName = e.target.value.substring(fileKind + 1, e.length);
    let fileType = fileName.toLowerCase();
    let checkFileType = ["jpg", "gif", "png", "jpeg", "bmp"];

    if (checkFileType.indexOf(fileType) === -1) {
      alert("확장자가 jpg, gif, png, jpeg, bmp인 이미지 파일만 올려주세요.");
      e.target.value = "";
      return false;
    } else if (e.target.files && e.target.files[0].size > (5 * 1024 * 1024)) {
      alert("업로드할 파일의 용량이 5mb가 넘습니다.")
      e.target.value = "";
    } else {
      this.setState({
        URL: URL.createObjectURL(e.target.files[0])
      });
      // eslint-disable-next-line react/prop-types
      const { setRepreImg } = this.props;
      setRepreImg(e.target.files[0]);
    }
    // let fileEl = document.getElementById("inputFile1");
    // console.log(fileEl);
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
            flexWrap: "wrap",
            paddingBottom: "3em"
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
            <label htmlFor="inputFile1" className="label-input">
              업로드
            </label>
            <input
              id="inputFile1"
              type="file"
              accept="image/jpeg, image/gif, image/png, image/jpg, image/bmp"
              hidden={true}
              onChange={e => this.fileUpload(e)}
            />
          </div>
          <hr className="hr-green" />
          <div className="ToBottom flex center-parent">
            <button
              style={{
                height: "1em"
              }}
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
