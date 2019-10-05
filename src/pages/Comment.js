import React from "react";
import { formatRelative } from "date-fns";
import { axiosInstance, config } from "../config";
import "../shared/App.css";
import styled from "styled-components";
export default class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentBtn: false,
      inputComment: "",
      problem_id: this.props.match.params.id,
      comments: []
    };
    this.MainSection = styled.section``;
    this.TextPart = styled.section``;
    this.BottomComp = styled.div``;
  }
  componentDidMount() {
    console.log(this.props);
    // let temp;
    axiosInstance
      .get(`/comment/${this.state.problem_id}`, config)
      .then(res => {
        // console.log("응답 response값:" + res.data);
        this.setState({ comments: JSON.parse(res.data) });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { comments } = this.state;
    const commentBtn = this.state.commentBtn;
    // console.log(comments);
    if (comments) {
      const list = comments.map((data, i) => (
        <section key={i} className="message-left">
          {data.img === null ? (
            <i className="nes-bcrikko" />
          ) : (
            <img
              className="thumbnail"
              style={{
                width: "100px",
                height: "100px",
                "object-fit": "cover",
                "border-radius": "50%"
              }}
              src={data.img}
              alt="image place"
            />
          )}
          <this.TextPart>
            <this.TopComp>
              <span style={{ fontStyle: " Italic", color: " blue" }}>
                {!data.nick ? " 익명의 더쿠" : data.nick}
              </span>
              <span className="span_em_small">
                {" "}
                {formatRelative(new Date(data.day), new Date())}
              </span>
            </this.TopComp>
            <this.BottomComp>
              <span className="span_em_default">{data.comment}</span>
            </this.BottomComp>
          </this.TextPart>
        </section>
      ));
      return (
        <this.MainSection className="message-list">
          {!commentBtn ? (
            <div>
              <textarea
                cols="100"
                rows="4"
                placeholder="의견을 남겨주세요"
              ></textarea>
              <button onClick={() => this.submitComment()}>댓글 쓰기</button>
              <button onClick={() => this.commentBtnHandle()}>
                댓글입력창
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => this.commentBtnHandle()}>
                댓글입력창없애기
              </button>
            </div>
          )}
          <div>Comments</div>
          {list}
        </this.MainSection>
      );
    } else {
      return (
        <this.MainSection>
          {!commentBtn ? (
            <div>
              <textarea
                cols="100"
                rows="4"
                placeholder="의견을 남겨주세요"
              ></textarea>
              <button onClick={() => this.submitComment()}>댓글 쓰기</button>
              <button onClick={() => this.commentBtnHandle()}>
                댓글입력창
              </button>
            </div>
          ) : (
            <div>
              <button onClick={() => this.commentBtnHandle()}>
                댓글입력창없애기
              </button>
            </div>
          )}
          아직 해당문제에 대한 의견이 없습니다.
        </this.MainSection>
      );
    }
  }
}
