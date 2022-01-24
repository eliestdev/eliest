import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import { login } from "./api";
import './index.css'
import BottomSVG from "components/bottomSVG";

function Index({ setToken }) {
  const dispatch = useDispatch();
  const loginError = useSelector(selectAuthError);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  let [user, setUser] = useState({
    email: "",
    password: "",
  });

  const updateField = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  let authenticate = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      let response = await login(user)
      if (response.status != "success") {
        console.log(response)
        dispatch(setAuthError(response.message))
      } else {
        console.log(response)
        dispatch(setAuthToken(JSON.stringify(response.data)))
        history.push("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <div className="login--section md:mx-auto md:flex md:justify-center lg:items-center md:h-full">
        <form className="sm:w-6/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0">
          <div className="pt-3 px-6 flex flex-col items-center justify-center">
            <h3 className="login-text--big">Sign in to your agent account</h3>
          </div>

          <div className="py-6 items-center justify-center">
            <div className="login-text--small text-center mx-auto">We’ve missed you, start winning big from all our available games.</div>
          </div>

          <div className="w-full px-6 md:px-2">
            <div className="flex flex-col mt-5 md:mt-2">
              <input className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="email"
                required
                name="email"
                value={user.email}
                onChange={(e) => { updateField(e) }}
                placeholder="Enter your mail" />
            </div>
            <div className="flex flex-col mt-5">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="password"
                name="password"
                required
                value={user.password}
                onChange={(e) => { updateField(e) }} placeholder="Enter your password" />
            </div>
            <div className="text-red-400 text-md md:text-xl sm:text-sm mt-4 ml-1">{loginError}</div>

          </div>
          <div className="mt-2 sm:pt-2 w-full flex justify-between px-6 sm:px-6">
            <div className="flex items-center">

            </div>
            <span className="text-xs forgot">
              Forgot Password?
              <Link className="recover text-green-500" to="/auth/resetpassword">Recover</Link>
            </span>
          </div>

          <div className="text-center create">
            <span>Don’t have an account?</span>
            <Link className="create--link text-green-500" to="/auth/register">Create account</Link>
          </div>

        </form>
      </div>

      <BottomSVG component={
        <button onClick={authenticate} disabled={isLoading} className="btn-primary focus:outline-none w-full transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big">{isLoading == true ? "Loading.." : "Sign in"}</button>
      } />
    </>
  );
}

Index.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Index;
