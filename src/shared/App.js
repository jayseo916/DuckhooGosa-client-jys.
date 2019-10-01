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
import FooterMenubar from "../components/FooterMenubar";
import UpLoadTest from "../client/upLoadTest";
import SolvingProblem from "../pages/SolvingProblem";
import NotFound from "../pages/NotFound";
import "./App.css";

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
    this.setState({
      email: null
    });
  };

  setUserInfo = data => {
    this.setState({ email: data.email, expires_at: data.expires_at }, () => {
      let { email, expires_at } = this.state;
      console.log(`${email}님 로그인 ${expires_at}에 토큰 만료`);
    });
  };

  setRepreImg = repreImg => {
    this.setState({ repreImg: repreImg }, () => {
      console.log("이미지 설정 완료");
    });
  };

  render() {
    const { email, expires_at } = this.state;
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/problem/main" component={Main} />
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
              return <Profile email={this.state.email} {...props} />;
            }}
          />
          <Route path="/not-found" component={NotFound} />
          <Route
            path="/SolvingProblem/:id"
            render={props => {
              if (!email) return <Redirect to="/login"></Redirect>;
              return <SolvingProblem email={this.state.email} {...props} />;
            }}
          />
          <Route path="/UpLoadTest" component={UpLoadTest} />
          <Route path="/main" render={props => <Main {...props} />} />
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
