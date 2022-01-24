import React, { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

// components

import Navbar from "components/navbar/AuthNavbar.js";

// views

import Login from "views/login";
import Register from "views/register";
import ForgetPassword from "views/forget_password";
import SetPassword from "views/setpassword";
import { setAuthError } from "features/authentication/authSlice";
import { useDispatch } from "react-redux";

Auth.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default function Auth() {
  let location = useLocation();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(setAuthError(""))

}, [location])
  return (
    <>
      <Navbar transparent />
      <main>
        <section>
          <Switch>
            <Route path="/auth/login" exact component={() => <Login />} />
            <Route path="/auth/register" exact component={() => <Register/>} />
            <Route path="/auth/resetpassword" exact component={() => <ForgetPassword/>} />
            <Route path="/auth/setpassword" exact component={() => <SetPassword/>} />
            <Redirect from="/" to="/auth/login" />
          </Switch>
        </section>
      </main>
    </>
  );
}
