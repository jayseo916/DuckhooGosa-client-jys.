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
import FooterMenubar from "../components/FooterMenubar";
import UpLoadTest from "../client/upLoadTest";
import SolvingProblem from "../pages/SolvingProblem";
import NotFound from "../pages/NotFound";
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
          <Route path="/problem/main" component={Main} />
          <Route path="/SelectGenre" component={SelectGenre} />
          <Route path="/SelectTheme" component={SelectTheme} />
          <Route path="/createProblem" component={CreateProblem} />
          <Route path="/5" component={MyProblem} />
          <Route path="/6" component={MySolved} />
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
          <Redirect to="/not-found" />
        </Switch>
        <FooterMenubar email={email} expires={expires_at} />
      </div>
    );
  }
}

export default App;
