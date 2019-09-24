import React from "react";

class SelectTheme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      selectedRepreFile: null,
      selectedBgImg: null
    };
  }
  handleTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }
  fileUpload1(e) {
    // this.setState({
    //   selectedFile: e.target.files[0]
    // });
    let target = e.target || window.event.srcElement,
      files = target.files;
    if (FileReader && files && files.length) {
      let fr = new FileReader();
      fr.onload = () => {
        localStorage["repreImg"] = fr.result; // localStorage에 image를 키값으로 갖고 value값이 data:경로
        // console.log(localStorage);
      };
      this.setState({
        selectedRepreFile: localStorage["repreImg"]
      });
      fr.readAsDataURL(files[0]);
    }
  }
  fileUpload2(e) {
    let target = e.target || window.event.srcElement,
      files = target.files;
    if (FileReader && files && files.length) {
      let fr = new FileReader();
      fr.onload = () => {
        localStorage["bgImg"] = fr.result;
      };
      this.setState({
        selectedBgImg: localStorage["bgImg"]
      });
      fr.readAsDataURL(files[0]);
    }
  }
  clickHandler() {
    if (this.state.title === "") {
      alert("문제 제목을 적어주세요");
    } else {
      if (this.state.selectedFile === null) {
        console.log("state.selectedfile없음");
        // const formData = new FormData();
        // formData.append("file", this.state.selectedFile);
        localStorage.setItem("title", this.state.title);
        this.props.history.push("/createProblem");
      } else {
        console.log("state.selectedFile있음");
        // const formData = new FormData();
        // formData.append("file", this.state.selectedFile);
        localStorage.setItem("title", this.state.title);
        this.props.history.push("/createProblem");
      }
    }
  }
  render() {
    // let count = 0;
    return (
      <div className="currentGenre">
        <p>현재 선택된 장르:{localStorage.getItem("genre")}</p>
        <input
          type="text"
          size="140"
          placeholder="문제 제목을 입력해주세요"
          onChange={e => this.handleTitleChange(e)}
        ></input>
        <br></br>
        <div>
          문제표시에 사용될 이미지를 골라주셈(고르지않을시 기본이미지가 선택됨)
        </div>
        <input
          id="inputFile1"
          type="file"
          name="files[]"
          onChange={e => this.fileUpload1(e)}
        ></input>
        <br></br>
        <div>문제지 배경화면을 골라주세요</div>
        <input
          id="inputFile2"
          type="file"
          onChange={e => this.fileUpload2(e)}
        ></input>
        <button onClick={() => this.clickHandler()}>문제 제작하기</button>
      </div>
    );
  }
}
export default SelectTheme;
