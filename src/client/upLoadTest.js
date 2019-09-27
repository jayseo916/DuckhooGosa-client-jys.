import React, { Component } from "react";
import { UploadToS3 } from "./upLoad";

class UpLoadTest extends Component {
  uploadAndGetLink = dir => {
    let files = document.getElementById("fileInput");
    let link = undefined;
    let result = UploadToS3(dir, files.files[0], link => {
      console.log("이건 받아온 링크", link);
    });
  };

  render() {
    return (
      <div>
        <input id="fileInput" type="file" accept="*" />
        <button
          id="uploadButton"
          onClick={() => {
            this.uploadAndGetLink("problem_1");
          }}
        >
          누르면 업로드 합니다
        </button>
      </div>
    );
  }
}

export default UpLoadTest;
