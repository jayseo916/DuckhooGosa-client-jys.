import React from "react";
import axios from "axios";
import { config } from "../config";
import { fakeData } from "../fakeData";
import { Route, Switch, Link, Redirect } from "react-router-dom";
import "./Main.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { // 실제로 사용할 state
    //   problems: null,
    //   currentOption: "",
    //   input: ""
    // };
    this.state = {
      // 서버가 완성되기 전까지 가짜데이터로 임시로 설정
      problems: [],
      currentOption: "",
      input: "",
      numberLoadingProblem: 3,
      countLoading: 0 //문제 받아온 횟수
    };
  }
  componentDidMount = async () => {
    // axios
    //   .get("http://localhost:8000/problem/main")
    //   .then(data => this.setState({ problems: data }))
    //   .catch(err => console.log("통신에러:", err));
    window.addEventListener("scroll", this.handleScroll);

    if (this.state.countLoading === 0) {
      const { data } = await axios.post("http://localhost:8000/problem/main", {
        next_problem: 0
      });
      console.log("데이타", typeof JSON.parse(data));
      this.setState({
        problems: JSON.parse(data)
      });
    }
  };
  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = async () => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;

    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 30) {
      let countLoading = this.state.countLoading + 1;
      console.log(countLoading);

      let { data } = await axios.post("http://localhost:8000/problem/main", {
        next_problem: this.state.numberLoadingProblem * countLoading
      });
      data = JSON.parse(data);
      let origin = this.state.problems.map(v => JSON.stringify(v));
      let newData = data.filter(v => {
        if (!origin.includes(JSON.stringify(v))) {
          return v;
        }
      });
      if (newData.length === 3) {
        let problems = [...this.state.problems, ...newData];

        this.setState({
          problems: problems,
          countLoading: countLoading
        });
      }
    }
  };

  handleSelect() {
    let curr = document.getElementById("currentGenre");
    let choiceOpt =
      curr.options[document.getElementById("currentGenre").selectedIndex].value;
    // console.log(choiceOpt);
    this.setState({
      currentOption: choiceOpt
    });
  }
  handleInput(e) {
    this.setState({
      input: e.target.value.trim()
    });
  }
  search() {
    if (this.state.input === "") {
      alert("단어를 입력하고 검색해주세요");
    } else {
      //  axios
      //   .get(`http://localhost:8000/?word=${this.state.input}`)
      //   .then(data => this.setState({ problems: data }))
      //   .catch(err => console.log(err));
    }
  }
  solvedProblem(e, id) {
    e.preventDefault();
    console.log(`/SolvingProblem/${id}`, "으로 보내줌");
    this.props.history.push(`/SolvingProblem/${id}`);
  }
  render() {
    // const { img, title, problem_id } = this.state.problems;
    // console.log("도큐먼트scrollHeight", document.documentElement.scrollHeight);
    // console.log("바디scrollHeight", document.body.scrollHeight);
    // console.log("도큐면트scrollTop", document.documentElement.scrollTop);
    // console.log("바디scrollTop", document.body.scrollTop);
    const problems = this.state.problems;
    return (
      <div className="container">
        <div className="top-search-bar">
          장르(검색시에는 적용되지않음)
          <select
            id="currentGenre"
            className="form-control"
            onChange={() => this.handleSelect()}
          >
            <option value="">모두</option>
            <option value="movie">영화</option>
            <option value="animation">애니메이션</option>
            <option value="game">게임</option>
            <option value="sports">스포츠</option>
            <option value="entertain">연예</option>
            <option value="military">군사</option>
          </select>
          <input
            type="text"
            id="inputTag"
            className="form-control"
            placeholder="이름 또는 태그로 검색"
            value={this.state.input}
            size="40"
            onChange={e => this.handleInput(e)}
          />
          <button onClick={() => this.search()}>찾기</button>
        </div>
        <hr></hr>
        <div className="problem-list">
          문제 모음집
          {this.state.problems.map((item, i) =>
            this.state.currentOption === "" ? (
              <div key={i} className="problems">
                <a href="/#">
                  <img
                    src={item.representImg}
                    alt="Responsive"
                    height="200"
                    width="300"
                    onClick={e => this.solvedProblem(e, item._id)}
                  />
                </a>
                <br></br>
                <a href="/#" onClick={e => this.solvedProblem(e, item._id)}>
                  {item.title}
                </a>
              </div>
            ) : this.state.currentOption === item.genre ? (
              <div key={item._id} className="problems">
                <a href="/#">
                  <img
                    src={item.representImg}
                    alt="Responsive"
                    height="200"
                    width="300"
                    onClick={e => this.solvedProblem(e, item._id)}
                  />
                </a>
                <br></br>
                <a href="/#" onClick={e => this.solvedProblem(e, item._id)}>
                  {item.title}
                  <br></br>
                  {item.tags}
                </a>
              </div>
            ) : (
              <div></div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Main;
