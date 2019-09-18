import React from "react";
import { Route } from "react-router-dom";
import Main from "../pages/Main";
import SelectGenre from "../components/SelectGenre";
import SelectTheme from "../components/SelectTheme";
import SelectProblemType from "../components/SelectProblemType";
import CreateProblem from "../components/CreateProblem";
import MyProblem from "../pages/MyProblem";
import MySolved from "../pages/MySolved";

class App extends React.Component {
  render() {
    return (
      <div>
        <Route path="/problem/main" component={Main} />
        <Route path="/1" component={SelectGenre} />
        <Route path="/2" component={SelectTheme} />
        <Route path="/3" component={SelectProblemType} />
        <Route path="/4" component={CreateProblem} />
        <Route path="/5" component={MyProblem} />
        <Route path="/6" component={MySolved} />
      </div>
    );
  }
}

export default App;
