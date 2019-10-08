import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactSVG from "react-svg";
const clientURL = "localhost:3000";
const chainImg = require("../client/img/link-1271843.svg");

class CopyUrl extends Component {
  render() {
    const _id = this.props.id;
    return (
      <CopyToClipboard
        className="clip-board"
        text={clientURL + `/SolvingProblem/${_id}`}
        onCopy={() => {
          alert("링크가 복사 되었습니다");
          this.setState({ copied: true });
        }}
      >
        <ReactSVG
          src={chainImg}
          alt="link"
          style={{
            height: 30,
            width: 30,
            position: "absolute",
            backgroundColor: "white"
          }}
          // className="clip-board"
        >
          링크복사
        </ReactSVG>
      </CopyToClipboard>
    );
  }
}

export default CopyUrl;
