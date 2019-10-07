import React from "react";
import { config, axiosInstance } from "../config";
import styled from "styled-components";

let mainApi = "/problem/main";
let searchApi = "/problem/search";
let genreApi = "/problem/genre";
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: [],
      searchProblems: [],
      numberLoadingSearchProblem: 5, //
      numberLoadingGenreProblem: 5,
      numberLoadingProblem: 5, //한번에 로딩 되는 문제 수
      countGenreLoading: 0,
      countSearchLoading: 0,
      countLoading: 0, //문제 받아온 횟수
      search: false,
      currentOption: "",
      input: "",
      genreOn: false,
      CurGenreNoData: false,
      CurSearchNoData: false,
      MainNoData: false
    };
  }
  componentDidMount = async () => {
    let countLoading = 0;
    this.state.search
      ? (countLoading = this.state.countSearchLoading)
      : (countLoading = this.state.countLoading);

    console.log("카운트로딩", countLoading);
    if (countLoading === 0 && this.state.search === false) {
      console.log("초기검색어", this.state.input);
      try {
        const { data } = await axiosInstance.post(
          this.state.search ? searchApi : mainApi,
          {
            next_problem: 0,
            word: this.state.input
          }
        );
        console.log("데이타", JSON.parse(data));
        this.state.search
          ? this.setState({ searchProblems: JSON.parse(data) })
          : this.setState({ problems: JSON.parse(data) });
      } catch (err) {
        console.log(err);
      }
    }
    console.log("붙었니?", "____________________");
    window.addEventListener("scroll", this.handleScroll);
  };
  componentWillUnmount() {
    // 언마운트 될때에, 스크롤링 이벤트 제거
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = async () => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    console.log(innerHeight, scrollHeight, "실시간 조회검사");
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    if (scrollHeight - innerHeight - scrollTop < 30) {
      let countLoading = 0;
      let loadingProblem = 0;

      if (!this.state.genreOn) {
        if (this.state.search) {
          countLoading = this.state.countSearchLoading;
          loadingProblem = this.state.numberLoadingSearchProblem;

          while (!this.state.CurSearchNoData) {
            try {
              var { data } = await axiosInstance.post(searchApi, {
                next_problem: loadingProblem * countLoading,
                word: this.state.input
              });
              data = JSON.parse(data);
              if (data === "NoData") {
                this.setState({
                  CurSearchNoData: true
                });
                break;
              }
              let origin = this.state.searchProblems.map(v =>
                JSON.stringify(v)
              );

              var newData = data.filter(v => {
                if (!origin.includes(JSON.stringify(v))) {
                  return v;
                }
              });
              countLoading += 1;
              if (newData.length !== 0) {
                break;
              }
            } catch (err) {
              console.log(err);
            }
          }

          if (!this.state.CurSearchNoData && data !== "NoData") {
            let problems = [...this.state.searchProblems, ...newData];
            let origin = this.state.problems.map(v => JSON.stringify(v));
            let filteringed = problems.filter(v => {
              if (!origin.includes(JSON.stringify(v))) {
                return v;
              }
            });
            let total = [...this.state.problems, ...filteringed];

            this.setState({
              searchProblems: problems,
              countSearchLoading: countLoading,
              problems: total
            });
          }
        } else {
          countLoading = this.state.countLoading;
          loadingProblem = this.state.numberLoadingProblem;
          while (!this.state.MainNoData) {
            try {
              var { data } = await axiosInstance.post(mainApi, {
                next_problem: loadingProblem * countLoading
              });

              data = JSON.parse(data);
              if (data === "NoData") {
                this.setState({
                  MainNoData: true
                });
                break;
              }
              let origin = this.state.problems.map(v => JSON.stringify(v));
              var newData = data.filter(v => {
                if (!origin.includes(JSON.stringify(v))) {
                  return v;
                }
              });
              countLoading += 1;
              if (newData.length !== 0) {
                break;
              }
            } catch (err) {
              console.log(err);
            }
          }
          if (!this.state.MainNoData && data !== "NoData") {
            let problems = [...this.state.problems, ...newData];
            this.setState({
              problems: problems,
              countLoading: countLoading
            });
          }
        }
        /////
      } else {
        countLoading = this.state.countGenreLoading;
        loadingProblem = this.state.numberLoadingGenreProblem;

        while (!this.state.CurGenreNoData) {
          try {
            var { data } = await axiosInstance.post(genreApi, {
              next_problem: loadingProblem * countLoading,
              genre: this.state.currentOption
            });

            data = JSON.parse(data);
            console.log("데이터", data);
            console.log("타입", typeof data);
            if (data === "NoData") {
              this.setState({
                CurGenreNoData: true
              });
              break;
            }
            let origin = this.state.problems.map(v => JSON.stringify(v));

            var newData = data.filter(v => {
              if (!origin.includes(JSON.stringify(v))) {
                return v;
              }
            });
            countLoading += 1;
            if (newData.length !== 0) {
              break;
            }
          } catch (err) {
            console.log(err);
          }
        }
        if (!this.state.CurGenreNoData && data !== "NoData") {
          console.log("화긴", data);
          let problems = [...this.state.problems, ...newData];
          this.setState({
            problems: problems,
            countGenreLoading: countLoading
          });
        }
      }
    }
  };

  handleSelect = async e => {
    // if(this.state.)////
    if (e.target.value !== "") {
      let curr = document.getElementById("currentGenre");
      let choiceOpt =
        curr.options[document.getElementById("currentGenre").selectedIndex]
          .value;
      // console.log(choiceOpt);
      this.setState(
        {
          currentOption: choiceOpt,
          CurGenreNoData: false,
          countGenreLoading: 0
        },
        async () => {
          try {
            let { data } = await axiosInstance.post(genreApi, {
              next_problem: 4,
              genre: this.state.currentOption
            });

            data = JSON.parse(data);

            if (data !== "NoData") {
              let origin = [];
              this.state.search
                ? (origin = this.state.searchProblems.map(v =>
                    JSON.stringify(v)
                  ))
                : (origin = this.state.problems.map(v => JSON.stringify(v)));

              let newData = data.filter(v => {
                if (!origin.includes(JSON.stringify(v))) {
                  return v;
                }
              });

              this.setState({
                problems: [...this.state.problems, ...newData],
                genreOn: true
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      );
    } else {
      let problems = [...this.state.problems];
      this.setState({
        genreOn: false,
        problems: problems,
        currentOption: ""
      });
    }
  };

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }
  search() {
    if (this.state.input === "") {
      this.setState({
        search: false,
        input: ""
      });
    } else if (this.state.input !== "" && this.state.input.length < 2) {
      alert("두글자 이상 입력해주세요");
    } else {
      this.setState(
        {
          search: true,
          countSearchLoading: 0,
          CurSearchNoData: false
        },
        async () => {
          console.log("카운트로딩검색시", this.state.countSearchLoading);
          let countLoading = 0;
          let loadingProblem = this.state.numberLoadingSearchProblem;

          while (!this.state.CurSearchNoData) {
            try {
              var { data } = await axiosInstance.post(searchApi, {
                next_problem: loadingProblem * countLoading,

                word: this.state.input
              });
              data = JSON.parse(data);
              if (data === "NoData") {
                this.setState({
                  CurSearchNoData: true
                });
                break;
              }

              countLoading += 1;
              if (data !== "NoData") {
                break;
              }
            } catch (err) {
              console.log(err);
            }
          }

          if (data !== "NoData") {
            this.setState({
              searchProblems: data,
              countSearchLoading: countLoading
            });
          } else {
            this.setState({
              searchProblems: [],
              countSearchLoading: countLoading
            });
          }
        }
      );
    }
  }
  solvedProblem(e, id) {
    e.preventDefault();
    console.log(`/SolvingProblem/${id}`, "으로 보내줌");
    this.props.history.push(`/SolvingProblem/${id}`);
  }
  render() {
    // const { img, title, problem_id } = this.state.problems;
    console.log(this.state.genreOn);
    const problems = this.state.search
      ? this.state.searchProblems
      : this.state.problems;

    const ImageBox = styled.div`
      height: 10em;
      width: 95%;
    `;

    return (
      <div
        className="flex fdc max-width pageCSS-white"
        style={{
          width: "fit-content",
          "overflow-scrolling": "auto"
        }}
      >
        <div
          className="flex-fixer flex fdc margin-center"
          style={{
            "flex-wrap": "wrap"
          }}
        >
          <div
            className="flex fdr"
            style={{
              padding: "0.75em 0 0.5em 0"
            }}
          >
            <div className="nes-select flex">
              <select
                required
                style={{
                  display: "flex !important",
                  height: "min-content",
                  width: "30%"
                }}
                id="currentGenre"
                className="form-control flex"
                onChange={e => {
                  this.handleSelect(e);
                }}
              >
                <option value="">Select...</option>
                <option value="movie">영화</option>
                <option value="animation">애니메이션</option>
                <option value="game">게임</option>
                <option value="sports">스포츠</option>
                <option value="entertain">연예</option>
                <option value="military">군사</option>
              </select>
            </div>

            <div className="nes-field is-inline flex">
              <input
                style={{
                  height: "min-content",
                  display: "flex !important",
                  width: "95%",
                  marginLeft: "0.3em",
                  marginRight: "0.3em"
                }}
                type="text"
                id="inputTag inline_field"
                className="nes-input flex"
                value={this.state.input}
                size="40"
                onChange={e => this.handleInput(e)}
              />
            </div>

            <button
              style={{
                display: "flex !important",
                height: "min-content",
                marginLeft: "0.3em"
              }}
              className="nes-btn flex-fixer"
              onClick={() => this.search()}
            >
              FIND
            </button>
          </div>
          {/*메인 카드리스트*/}
          <div className="nes-container-card nes-container with-title is-centered">
            <p className="title t-color font-2P"> Preview </p>
            <div className="flex fdc">
              {problems.map((item, i) =>
                this.state.currentOption === "" ? (
                  <div>
                    <div
                      key={i + item._id}
                      className="flex margin-center fdc center-parent"
                    >
                      <a href="/#" className="flex">
                        <ImageBox className="flex-fixer main-thumbnail-wrap margin-center">
                          <img
                            style={{
                              maxheight: "20em"
                            }}
                            className="thumbnail main-thumnail-img img_border_5"
                            src={item.representImg}
                            alt="Responsive"
                            width="100%"
                            onClick={e => this.solvedProblem(e, item._id)}
                          />
                        </ImageBox>
                      </a>
                      <a
                        href="/#"
                        onClick={e => this.solvedProblem(e, item._id)}
                      >
                        <h4>{item.title}</h4>
                      </a>
                    </div>
                    <hr className="main-hr" />
                  </div>
                ) : this.state.currentOption === item.genre ? (
                  <div key={item._id + i} className="problems">
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
                      {/* {item.tags} */}
                    </a>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
