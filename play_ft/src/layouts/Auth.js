import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Play from "views/play";
import { setAuthError } from "features/authentication/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Login from "views/login/"
import Register from 'views/register/'
import ForgotPassword from "views/forgot-password";
import Landing from 'views/landing'
import { GetProfile } from "api/fetch";
import { setProfile } from "features/authentication/authSlice";
import Voucher from "ui/Voucher";

export default function Auth() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token)
  useEffect(() => {
    dispatch(setAuthError(""))
  })

  const getProfile = async (token) => {
    const res = await GetProfile(token)
    const data = await res.json()
    dispatch(setProfile(data.data))
  }

  useEffect(() => {
    if(token){
      getProfile(token)
    }
    return () => { };
  }, [token]);

  return (
    <div className="">
      <Switch>
        <Route path="/play/games" exact component={() => token ? <Play /> : <Redirect from="/" to="/login" />} />
        <Route path="/login" component={Login} />
        <Route path="/recover" component={ForgotPassword} />
        <Route path="/voucher" component={Voucher} />
        <Redirect from="/" to="/login" />
      </Switch>
    </div>
  );
}
