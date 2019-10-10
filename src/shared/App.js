import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Main from "../pages/Main";
import SelectGenre from "../components/SelectGenre";
import SelectTheme from "../components/SelectTheme";
import CreateProblem from "../components/CreateProblem";
import MyProblem from "../pages/MyProblem";
import MySolved from "../pages/MySolved";
import Loading from "../pages/Loading";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import Private from "../pages/Private";
import FooterMenubar from "../components/FooterMenubar";
import SolvingProblem from "../pages/SolvingProblem";
import Comment from "../pages/Comment";
import NotFound from "../pages/NotFound";
import Linked from "../pages/Linked";
import LoadingComponent from "../components/LoadingComponent";
import "./App.css";
import Axios from "axios";

let isDev = null;
if (process.env.REACT_APP_LOG === "TRUE") {
  isDev = true;
}
class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: null,
      expires_at: null,
      repreImg: null,
      isRefreshing: false
    };
  }

  componentDidMount() {
    if (
      localStorage.access_token &&
      localStorage.email &&
      localStorage.expires_in
    ) {
      let key = localStorage.getItem("access_token");
      isDev && console.log(key, "토큰검사");
      Axios.get(
        "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + key
      ).then(res => {
        isDev && console.log(res.data, "검증 1회");
        if (res.data["expires_in"] === undefined) {
          isDev && console.log("잘못된 토큰 검증 집으로");
          localStorage.clear();
          this.props.history.push("/login");
        } else {
          isDev && console.log("@@ 토큰 안전함 @@");
          if (this.state.isRefreshing === true) {
            this.setState({ email: res.data.email });
          }
        }
      });
    }
  }

  refreshStart = () => {
    this.setState({ isRefreshing: true }, () => {
      isDev && console.log("리프레시 스타트~~");
    });
  };

  emptyEmail = () => {
    this.setState((state, props) => ({
      email: null
    }));
  };

  setUserInfo = data => {
    this.setState({ email: data.email, expires_at: data.expires_at }, () => {
      let { email, expires_at } = this.state;
      let time = new Date(expires_at + 3600);
      isDev && console.log(`${email}님 로그인 ${time}에 토큰 만료`);
    });
  };

  setRepreImg = repreImg => {
    this.setState({ repreImg: repreImg }, () => {
      isDev && console.log("이미지 설정 완료");
    });
  };

  render() {
    const { email, expires_at } = this.state;
    return (
      <div style={{}} className="App">
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/problem/main" component={Main} />
          <Route path="/loading" component={LoadingComponent} />
          <Route
            path="/selectGenre"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <SelectGenre {...props} />;
            }}
          />
          <Route
            path="/selectTheme"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <SelectTheme setRepreImg={this.setRepreImg} {...props} />;
            }}
          />
          <Route
            path="/private"
            render={props => {
              return <Private {...props} />;
            }}
          />
          <Route
            path="/createProblem"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return (
                <CreateProblem
                  setRepreImg={this.setRepreImg}
                  email={this.state.email}
                  repreImg={this.state.repreImg}
                  {...props}
                />
              );
            }}
          />
          {/* <Route
            path="/comment/:id"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <Comment {...props} />;
            }}
          /> */}
          <Route
            path="/myProblem"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <MyProblem {...props} />;
            }}
          />
          <Route
            path="/mySolved"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <MySolved {...props} />;
            }}
          />
          <Route
            path="/profile"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return (
                <Profile
                  email={this.state.email}
                  emptyEmail={this.emptyEmail}
                  {...props}
                />
              );
            }}
          />
          <Route path="/not-found" component={NotFound} />
          <Route
            path="/Linked"
            refreshStart={this.refreshStart}
            component={Linked}
          />
          <Route
            path="/SolvingProblem/:id"
            render={props => {
              if (!email)
                return (
                  <Redirect
                    to={{
                      pathname: "/Linked",
                      problemId: props.match.params.id,
                      setUserInfo: this.setUserInfo
                    }}
                  />
                );
              return <SolvingProblem email={this.state.email} {...props} />;
            }}
          />
          <Route path="/main" render={props => <Main {...props} />} />
          <Route
            path="/comment/:id"
            render={props => {
              if (!email)
                return (
                  <Redirect
                    to={{
                      pathname: "/Login"
                    }}
                  />
                );
              return <Comment email={this.state.email} {...props} />;
            }}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                refreshStart={this.refreshStart}
                setUserInfo={this.setUserInfo}
                emptyEmail={this.emptyEmail}
                {...props}
              />
            )}
          />
          {/* <Redirect to="/not-found" /> */}
        </Switch>
        <FooterMenubar email={email} expires={expires_at} />
      </div>
    );
  }
}

export default App;
