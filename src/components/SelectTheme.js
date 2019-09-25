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
  fileUpload(e) {
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
  clickHandler() {
    if (this.state.title === "") {
      alert("문제 제목을 적어주세요");
    } else {
      localStorage.setItem("title", this.state.title);
      this.props.history.push("/createProblem");
    }
  }
  render() {
    const repreImg = this.state.selectedRepreFile;
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
          onChange={e => this.fileUpload(e)}
        ></input>
        {repreImg ? <div><img src={repreImg} alt="대표이미지" height="200" width="300"></img></div> : <div></div>}

        <br></br>

        <button onClick={() => this.clickHandler()}>문제 제작하기</button>
      </div>
    );
  }
}
export default SelectTheme;
