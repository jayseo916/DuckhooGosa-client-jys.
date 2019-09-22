import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "../pages/Main";
import SelectGenre from "../components/SelectGenre";
import SelectTheme from "../components/SelectTheme";
import CreateProblem from "../components/CreateProblem";
import MyProblem from "../pages/MyProblem";
import MySolved from "../pages/MySolved";
import Loading from "../pages/Loading";
import Login from "../pages/Login";
import Complete from "../components/CompleteProblem";
import FooterMenubar from "../components/FooterMenubar";
import UpLoadTest from "../client/upLoadTest";
import "./App.css";

class App extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: null,
      expires_at: null
    };
  }

  setUserInfo = data => {
    this.setState({ email: data.email, expires_at: data.expires_at }, () => {
      let { email, expires_at } = this.state;
      console.log(`${email}님 로그인 ${expires_at}에 토큰 만료`);
    });
  };

  render() {
    const { email, expires_at } = this.state;
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/problem/main" component={CreateProblem} />
          <Route path="/SelectGenre" component={SelectGenre} />
          <Route path="/SelectTheme" component={SelectTheme} />
          <Route path="/4" component={CreateProblem} />
          <Route path="/5" component={MyProblem} />
          <Route path="/6" component={MySolved} />
          <Route path="/UpLoadTest" component={UpLoadTest} />
          <Route path="/main" render={props => <Main {...props} />} />
          <Route
            path="/login"
            render={props => (
              <Login {...props} setUserInfo={this.setUserInfo} />
            )}
          />
        </Switch>
        <FooterMenubar email={email} expires={expires_at} />
      </div>
    );
  }
}

export default App;
