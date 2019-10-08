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

const isDev = process.env.REACT_APP_LOG;
class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: localStorage.getItem("authData")
        ? JSON.parse(localStorage.getItem("authData")).profileObj.email
        : null,
      expires_at: null,
      repreImg: null
    };
  }

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
          <Route path="/Linked" component={Linked} />
          <Route
            path="/SolvingProblem/:id"
            render={props => {
              // console.log(email, "어디보자");
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
          <Route path="/comment/:id" component={Comment} />
          <Route
            path="/login"
            render={props => (
              <Login
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
