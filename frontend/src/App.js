import "./App.css";
import { HomePage } from "./containers/HomePage/HomePageIndex";
import { Login } from "./containers/Login/LoginIndex";
import { ProfileEdit } from "./containers/Profile/ProfileIndex";
import { UserMain } from "./containers/UserMain/UserMainIndex";
import { JobDetails } from "./containers/JobDetails/JobDetaisIndex";
import React, { useState, useEffect } from "react";
import AuthService from "./services/auth.service.js";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { UserDetails } from "./data";


function App() {
  const [currentUser, setCurrentUser] = useState({token:"temp", user: UserDetails[0]});

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        else {
            console.log("oops")
        }
    }, []);

  const logOut = () => {
    AuthService.logout();
  };

  if(currentUser.token==="temp") {
    return (
      <Router>
        <Switch>
        <Route path = {["/", "/main"]} exact component = {HomePage} />
        <Route path={["/login", "/jobs", "/jobdetails", "/Settings"]} exact component={Login} />
        </Switch>
      </Router>
    );
    }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path = {["/", "/main"]} exact component = {HomePage} />
          <Route path = "/login" exact component = {Login} />
          <Route path = "/Settings" exact component = {ProfileEdit} />
          <Route path = "/jobs" exact component = {UserMain} />
          <Route path = "/jobdetails" exact component = {JobDetails} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;