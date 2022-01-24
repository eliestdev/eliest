import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";
import { register } from "./api";
import { useLocalStorage } from "hooks/useLocalStorage";
import useFetch from "react-fetch-hook";
import { useDispatch } from "react-redux";

import { setAuthError } from "features/authentication/authSlice";

function Index(props) {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const dispatch = useDispatch();
  const history = useHistory();
  let [agent, setAgent] = useState({
    email: useQuery().get("user"),
    password: "",
    password: "",
    token: "reset code",
  });

  const updateField = (e) => {
    setAgent({
      ...agent,
      [e.target.name]: e.target.value,
    });
  };

  let authenticate = (e) => {
    e.preventDefault();
    setPassword()
    e.preventDefault();
  };

  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);

  const setPassword = async () =>{
    setIsLoading(true)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(agent)
      };
    
      fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/setpassword`, requestOptions)
            .then(async response => {
              setIsLoading(false)
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();
                // check for error response
                if (!response.ok) {
                    // get error message from body or default to response status
                    const error = (data) || response;
                    return Promise.reject(error);
                }
                setError("Congratulation!! Your password has been updated!! continue to login")

            })
            .catch(async error => {
                let err = await error
            setError(err.error)
                
            });
      }
 

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-gray-900 border-0">
              <div className="flex-auto px-4 lg:px-10 py-10 pb-3 pt-0">
                <div className="text-green-200 text-center mb-3 font-bold pt-5 text-base">
                  <p class="my-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-100 sm:text-4xl">
                    Reset Password
                  </p>
                  <h5>Set your password</h5>
                </div>
                <form onSubmit={(e)=>authenticate(e)}>
                  <div className="relative w-full mb-3">
                    <input
                      type="text"
                      required
                      name="token"
                      onChange={updateField}
                      value={agent.token}
                      className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-green-200 text-xs font-bold mb-2"
                      htmlFor="password"
                    >
                      Set Password{" "}
                    </label>
                    <input
                      type="password"
                      required
                      name="password"
                      value={agent.password}
                      onChange={updateField}
                      className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Set password"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-green-200 text-xs font-bold mb-2"
                      htmlFor="c_password"
                    >
                      Confirm Password{" "}
                    </label>
                    <input
                      type="password"
                      required
                      name="c_password"
                      value={agent.c_password}
                      onChange={updateField}
                      className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Confirm password"
                    />
                  </div>

                  {error && <small className="text-red-400">{error}</small>}

                  <div className="text-center mt-6">
                    <input
                      className={
                        "bg-green-800 text-white active:bg-gray-500 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      }
                      type="submit"
                      disabled={isLoading}
                      value={isLoading == true ? "loading.." : "Set Password"}
                    />
                  </div>
                </form>
                <div className="w-full text-center mt-2">
                  <Link to="/auth/login" className="text-green-200">
                    <small>Login Now</small>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
Index.propTypes = {};
export default Index;
