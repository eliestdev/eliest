import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { loginAsync } from "features/authentication/authSlice";
import { selectAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import { login } from "./api";

function Index({ setToken }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const loginError = useSelector(selectAuthError);
  const history = useHistory()
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
        let {partner} = response.data
        localStorage.setItem("user", JSON.stringify(partner))
        dispatch(setAuthToken(partner))
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
     <section className="bg-indigo-600 {-- h-screen --}">
            <div className="mx-auto flex justify-center lg:items-center h-full">
                <form  onSubmit={authenticate} className="w-full sm:w-4/6 md:w-3/6 lg:w-4/12 xl:w-3/12 text-white py-12 px-2 sm:px-0">
                    <div className="pt-0 px-2 flex flex-col items-center justify-center">
                        
                        <h2 className="text-4xl leading-tight pt-8">Eliest</h2>
                    </div>
                    <div className="pt-16 px-2 flex flex-col items-center justify-center">
                        <h3 className="text-2xl sm:text-3xl xl:text-2xl font-bold leading-tight">Login To Your Account</h3>
                    </div>
                    <div className="mt-12 w-full px-2 sm:px-6">
                        <div className="flex flex-col mt-5">
                            <label htmlFor="email" className="text-lg font-semibold leading-tight">
                                Email
                            </label>
                            <input onChange={updateField} required id="email" name="email" className="h-10 px-2 w-full text-white bg-indigo-700 rounded mt-2 focus:outline-none shadow" type="email" />
                        </div>
                        <div className="flex flex-col mt-5">
                            <label htmlFor="password" className="text-lg font-semibold fleading-tight">
                                Password
                            </label>
                            <input onChange={updateField} required id="password" name="password" className="h-10 px-2 w-full text-white bg-indigo-700 rounded mt-2 focus:outline-none shadow" type="password" />
                        </div>
                    </div>
                    <div className="pt-6 w-full flex justify-between px-2 sm:px-6">
                        <div className="flex items-center">
                            <input  name="password" id="rememberme" className="w-3 h-3 mr-2" type="checkbox" />
                            <label   htmlFor="rememberme" className="text-xs" name="password">
                                Remember Me
                            </label>
                        </div>
                        <a className="text-xs" href="javascript: void(0)">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="px-2 sm:px-6">
                        <button className="focus:outline-none w-full bg-white transition duration-150 ease-in-out hover:bg-gray-200 rounded text-indigo-600 px-8 py-3 text-sm mt-6">Login</button>
                        
                    </div>
                </form>
            </div>
        </section>
    </>
  );
}

Index.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Index;
