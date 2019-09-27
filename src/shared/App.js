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
import Complete from "../components/CompleteProblem";
import FooterMenubar from "../components/FooterMenubar";
import UpLoadTest from "../client/upLoadTest";
import SolvingProblem from "../pages/SolvingProblem";
import NotFound from "../pages/NotFound";
import "./App.css";

class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: JSON.parse(localStorage.getItem("authData")).profileObj.email,
      expires_at: null,
      repreImg: null,
    };
  }

  setUserInfo = data => {
    this.setState({ email: data.email, expires_at: data.expires_at }, () => {
      let { email, expires_at } = this.state;
      console.log(`${email}님 로그인 ${expires_at}에 토큰 만료`);
    });
  };

  setRepreImg = repreImg => {
    this.setState({repreImg: repreImg}, () => {
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
          <Route path="/selectGenre" component={SelectGenre} />
          <Route
              path="/selectTheme"
              render={props => (
                  <SelectTheme {...props} setRepreImg={this.setRepreImg}/>
              )}
          />
          <Route
              path="/createProblem"
              render={props => (
                  <CreateProblem {...props} email={this.state.email} repreImg={this.state.repreImg}/>
              )}
          />
          <Route path="/comment/:id" component={Comment} />
          <Route path="/myProblem" component={MyProblem} />
          <Route path="/mySolved" component={MySolved} />
          <Route path="/profile" component={Profile} />
          <Route path="/not-found" component={NotFound} />
          <Route path="/SolvingProblem/:id" component={SolvingProblem} />
          <Route path="/UpLoadTest" component={UpLoadTest} />
          <Route path="/main" render={props => <Main {...props} />} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} setUserInfo={this.setUserInfo} />
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
