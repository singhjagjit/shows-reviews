import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MyNavbar from "./components/mynavbar";
import Login from "./components/login";
import Register from "./components/register";
import ShowsList from "./components/showslist";
import Show from "./components/show";
import NotFound from "./components/notfound";

function App() {
  return (
    <Router>
      <div className="container">
        <MyNavbar />
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/showslist" exact component={ShowsList} />
          <Route path="/show/:id" exact component={Show} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
