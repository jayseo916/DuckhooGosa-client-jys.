import React from "react";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: null,
      currentOption: null,
      input: null
    };
  }
  componentDidMount() {
    fetch("http://localhost:8000/problem/main")
      .then(res => res.json())
      .then(data => this.setState({ problems: data }))
      .catch(err => console.log("통신에러:", err));
  }
  handleSelect() {
    let curr = document.getElementById("currentGenre");
    let choiceOpt =
      curr.options[document.getElementById("currentGenre").selectedIndex].value;
    console.log(choiceOpt);
    this.setState({
      currentOption: choiceOpt
    });
  }
  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }
  search() {
    fetch(
      `http://localhost:8000/?word=${this.state.input}&genre=${this.state.currentOption}`
    )
      .then(res => res.json())
      .then(data => this.setState({ problems: data }))
      .catch(err => console.log(err));
  }
  solvedProblem(id) {
    fetch(`http://localhost:8000/problem?id=${id}`)
      .then(res => res.json())
      .then(item => this.props.history.push("/SolvedProblem"))
      .catch(err => console.log(err));
  }
  render() {
    // const { img, title, problem_id } = this.state.problems;
    return (
      <div>
        장르:
        <select id="currentGenre" onChange={() => this.handleSelect()}>
          <option value="movie">영화</option>
          <option value="animation">애니메이션</option>
          <option value="game">게임</option>
          <option value="sports">스포츠</option>
          <option value="entertain">연예</option>
        </select>
        <input
          type="text"
          id="inputTag"
          onChange={e => this.handleInput(e)}
        ></input>
        <button onClick={() => this.search()}>찾기</button>
        <hr></hr>
        <div>
          {this.state.problems.map(item => (
            <div key={item.problem_id}>
              <img
                src={item.img}
                alt="문제집"
                onClick={e => this.solvedProblem(e, item.problem_id)}
              />
              <p onClick={e => this.solvedProblem(e, item.problem_id)}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Main;
