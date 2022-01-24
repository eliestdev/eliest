import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/index.css";
import Auth from 'layouts/Auth';

function App(props) {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Auth />
          </Route>
        </Switch>
      </BrowserRouter>
    </>)
}

export default App;
