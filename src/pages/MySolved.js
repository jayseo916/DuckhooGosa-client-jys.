import React from "react";
import styled, { css } from "styled-components";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

class MySolved extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const Card = styled.div`
      padding: 0 0 0.5em !important;
    `;
    const ImageBox = styled.div`
      height: 8em;
      width: 70%;
    `;

    //     const Box = styled.div`
    //   /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
    //   background: ${props => props.color || 'blue'};
    //   padding: 1rem;
    //   display: flex;
    // `;
    //  ==> 함수형 컴포넌트로 만들어서 쓸대 필요함.

    //   const Button = styled.button`
    //   background: white;
    //   color: black;
    //   border-radius: 4px;
    //   padding: 0.5rem;
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    //   box-sizing: border-box;
    //   font-size: 1rem;
    //   font-weight: 600;
    //
    //   /* & 문자를 사용하여 Sass 처럼 자기 자신 선택 가능 */
    //   &:hover {
    //     background: rgba(255, 255, 255, 0.9);
    //   }
    //
    //   /* 다음 코드는 inverted 값이 true 일 때 특정 스타일을 부여해줍니다. */
    //   ${props =>
    //         props.inverted &&
    //         css`
    //       background: none;
    //       border: 2px solid white;
    //       color: white;
    //       &:hover {
    //         background: white;
    //         color: black;
    //       }
    //     `};
    //   & + button {
    //     margin-left: 1rem;
    //   }
    // `;
    //
    //     const StyledComponent = () => (
    //         <Box color="black">
    //           <Button>안녕하세요</Button>
    //           <Button inverted={true}>테두리만</Button>
    //         </Box>
    //     );

    console.log(this.props.history.location.state.userInfo);
    const { solutions } = this.props.history.location.state.userInfo;
    const historyList = solutions.map(el => {
      return (
        <Card
          key={el.problem_id}
          className="nes-container with-title is-rounded"
        >
          <p className="title"> {el.title} </p>
          <div className="flex-container-row is-rounded is-centered">
            <div className="left-col flex-container-col">
              <span className="nes-text is-error flex">
                님 정답률!{el.successRate}%
              </span>
              <span className="nes-text is-primary flex">
                언제 풀었어? {formatRelative(el.solved_date, new Date())}
              </span>
            </div>
            <ImageBox className="flex-fixer thumbnail-wrap">
              <img className="thumbnail" src={el.img} alt="image place" />
            </ImageBox>
          </div>
        </Card>
      );
    });
    return (
      <div className="nes-container with-title">
        <p className="title"> 풀었던 문제들 </p>
        <div className="top-container">{null}</div>
        <div className="middle-container">{historyList}</div>
        <div className="bottom-container">{null}</div>
      </div>
    );
  }
}
export default MySolved;
