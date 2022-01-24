import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect, Router } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/index.css";
import { useSelector, useDispatch } from 'react-redux';
import './App.css'
import Auth from 'layouts/Auth';
import Admin from 'layouts/Admin';
import { selectToken } from 'features/authentication/authSlice';

function App(props) {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  console.log(token)
  useEffect(()=>{
    console.log(token)
  },[token])
  return (
    <>
      {   token ? (
        <BrowserRouter>
          <Switch>
            <Route path="/">
              <Admin token={"token.access_token"} />
            </Route>
          </Switch>
        </BrowserRouter>

      )

        : (
          <BrowserRouter>
            <Switch>
              <Route path="/">
                <Auth  />
              </Route>
            </Switch>
          </BrowserRouter>


        )

      }



    </>)



}



export default App;
