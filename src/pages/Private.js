import React from "react";
import "../shared/App.css";
import Iframe from "react-iframe";
import styled from "styled-components";

class Private extends React.Component {

  render() {
    const IframeContainer = styled.div`
      margin-left: auto;
      margin-right: auto;
      padding: 0 0 0.5em !important;
      height: 1000px;
      max-width: 700px;
      overflow: auto;
    `;
    return (
      <div>
        <IframeContainer className="nes-container with-title">
          <Iframe
            url="https://duckhoogosa-client-deploy.s3.ap-northeast-2.amazonaws.com/policy.html"
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="flex"
            position="relative"
          />
        </IframeContainer>
      </div>
    );
  }
}

export default Private;
