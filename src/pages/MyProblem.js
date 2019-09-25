import React from "react";
import axios from "axios";
import { Popconfirm } from "antd";

class MyProblem extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     problems: ""
  //   };
  // }
  // componentDidMount() {
  //   axios
  //     .get(
  //       `http://localhost:8000/?email=${this.props.location.state.userInfo.email}`
  //     )
  //     .then(res => this.setState({ problems: res })) // 응답으로 problemSchema의 제목,날짜,대표이미지를 받아
  //     .catch(err => console.log("본인이 낸 문제 가져오기err:" + err));
  // }
  // solving(id) {
  //   this.props.history.push(`/SolvingProblem/${id}`);
  // }
  // render() {
  //   const problems = this.state.problems;
  //   return (
  //     <div>
  //       {problems.map(items => {
  //         <Popconfirm
  //           title="해당 문제를 푸시겠습니까?"
  //           okText="Yes"
  //           cancelText="No"
  //           onConfirm={() => this.solving(items._id)}
  //         >
  //           <div key={items._id}>
  //             {items.title}
  //             <img
  //               src={items.representImg}
  //               alt="대표이미지"
  //               height="220"
  //               width="310"
  //             ></img>
  //             {items.date.toLocateString()}
  //           </div>
  //         </Popconfirm>;
  //       })}
  //     </div>
  //   );
  // }
}
export default MyProblem;
