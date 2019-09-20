import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "../pages/Main";
import SelectGenre from "../components/SelectGenre";
import SelectTheme from "../components/SelectTheme";
import SelectProblemType from "../components/SelectProblemType";
import CreateProblem from "../components/CreateProblem";
import MyProblem from "../pages/MyProblem";
import MySolved from "../pages/MySolved";
import Loading from "../pages/Loading";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Loading} />
          <Route path="/problem/main" component={CreateProblem} />
          <Route path="/1" component={SelectGenre} />
          <Route path="/2" component={SelectTheme} />
          <Route path="/3" component={SelectProblemType} />
          <Route path="/4" component={CreateProblem} />
          <Route path="/5" component={MyProblem} />
          <Route path="/6" component={MySolved} />
        </Switch>
      </div>
    );
  }
}

export default App;
