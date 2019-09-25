import React from "react";
import axios from "axios";

class MyProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: ""
    };
  }
  componentDidMount() {
    axios
      .get(
        `http://localhost:8000/?email=${this.props.location.state.userInfo.email}`
      )
      .then(res => this.setState({ problems: res })) // 응답으로 problemSchema의 제목,날짜,대표이미지를 받아
      .catch(err => console.log("본인이 낸 문제 가져오기err:" + err));
  }
  openPop(e, img) {
    e.preventDefault();
    let win = window.open("/problemImg", "viewProb", "width=400,height=300");
    win.document.write(`<div><img 
    src=${img} height="150" width="120"></img>
    <button></button></div>`);
  }
  render() {
    const problems = this.state.problems;
    return (
      <div>
        {problems.map(items => {
          <a href="#" onClick={e => this.openPop(e, items.representImg)}>
            <div key={items._id}>
              {items.title}
              <img
                src={items.representImg}
                alt="대표이미지"
                height="220"
                width="310"
              ></img>
              {items.date.toLocateString()}
            </div>
          </a>;
        })}
      </div>
    );
  }
}
export default MyProblem;
