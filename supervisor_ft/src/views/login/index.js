import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import { login } from "./api";
import "./index.css"
import BottomSVG from "../../components/bottomSVG"

function Index({ setToken }) {
  const dispatch = useDispatch();
  const loginError = useSelector(selectAuthError);
  const [isLoading, setIsLoading] = useState(false);

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
      if (response.status != "SUCCESS") {
        console.log(response)

        dispatch(setAuthError(response.message))
      } else {
        console.log(response)
        dispatch(setAuthToken(JSON.stringify(response.data)))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      {/* <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-900 border-0">
              <div className="rounded-t mb-0 px-6 py-6"></div>
              <div className="flex-auto px-6 lg:px-10 py-10 pt-0">
                <div className="text-gray-300 text-center mb-3 font-bold">
                  <p class="my-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-100 sm:text-4xl">
                    Eliest Lotto
                  </p>
                  <small>Sign into account</small>
                </div>
                <form onSubmit={authenticate}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-green-200 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      {" "}
                      Email{" "}
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={user.email}
                      onChange={(e) => { updateField(e)}}
                      className="border-0 px-3 py-3 placeholder-gray-500 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-green-200 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Password{" "}
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      value={user.password}
                      onChange={(e) => { updateField(e)}}
                      className="border-0 px-3 py-3 placeholder-gray-500 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-green-200">
                        Remember me{" "}
                      </span>
                    </label>
                  </div>
                  <small className="text-red-400">{loginError}</small>
                  <div className="text-center mt-6">
                    <input
                      className={"bg-green-800 text-white active:bg-gray-500 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"}
                      type="submit"
                      disabled={isLoading}
                      value={isLoading == true ? "loading..":"Sign in"}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
              <Link to="/auth/resetpassword" className="text-green-200">
                  <small>Forgot password?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-green-200">
                  <small>Become an supervisor</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="login--section md:mx-auto md:flex md:justify-center lg:items-center md:h-full">
        <form className="sm:w-6/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0" onSubmit={authenticate}>
          <div className="py-3 px-6 flex flex-col items-center justify-center">
            <h3 className="login-text--big">Sign in to your supervisor account</h3>
          </div>

          <div className="items-center justify-center">
            <div className="login-text--small text-center mx-auto mt-8 mb-6 md:mt-16">We’ve missed you, start winning big from all our available games.</div>
          </div>

          <div className="w-full px-6 md:px-2">
            <div className="flex flex-col mt-3">
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
          <div className="sm:pt-2 w-full flex justify-between px-6 sm:px-6">
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
