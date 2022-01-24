import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { loginAsync } from "features/authentication/authSlice";
import { selectAuthError } from "features/authentication/authSlice";
import useFetch from "react-fetch-hook";
import { setAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import BottomSVG from "components/bottomSVG";

function ForgetPassword({ setToken }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const loginError = useSelector(selectAuthError);

  let [user, setUser] = useState({
    email: "",
  });

  const updateField = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  let authenticate = async (e) => {
    e.preventDefault();
    setLoginRandom(Math.random());
  };
  console.log(process.env.REACT_APP_ENDPOINT_URL);

  const [loginRandom, setLoginRandom] = useState();

  const { isLoading, data, error } = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}resetpassword`,
    {
      depends: [loginRandom],
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );
  if (data) {
    dispatch(setAuthError("Check your mail for instructions on how to set your password!"));
  }
  if (error) {
    dispatch(setAuthError("Invalid Email Address"));
  }

  return (
    <>
      <div className="login--section">
        <div className="mx-auto flex justify-center lg:items-center h-full">
          <form className="sm:w-4/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0" onSubmit={authenticate}>
            <div className="pt-10 px-2 flex flex-col items-center justify-center">
              <h3 className="login-text--big">Forgot password?</h3>
            </div>

            <div className="pt-6 items-center justify-center">
              <div className="login-text--small text-center mx-auto">Still keep track of your account and games</div>
            </div>

            <div className="mt-8 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <input required
                  name="email"
                  value={user.email}
                  onChange={(e) => { setLoginRandom(null); updateField(e) }}
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="email" placeholder="Enter your email address" />
              </div>

              <small className="text-red-400">{loginError}</small>
            </div>

            <div className="px-2 sm:px-6 mt-4">
              <input className="focus:outline-none w-full bg-green-600 transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big" type="submit"
                disabled={isLoading}
                value={isLoading == true ? "loading.." : "Continue"} />
            </div>
          </form>
        </div>
      </div>
      <BottomSVG />
    </>
  );
}

ForgetPassword.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default ForgetPassword;
