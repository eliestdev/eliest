import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";
import { register } from "./api";
import { useLocalStorage } from "hooks/useLocalStorage";
import useFetch from "react-fetch-hook";
import { useDispatch } from "react-redux";
import BottomSVG from '../../components/bottomSVG'
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
    c_password: "",
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

  const setPassword = async () => {
    setIsLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent)
    };

    fetch(`${process.env.REACT_APP_SUPERVISOR_URL}v1/setpassword`, requestOptions)
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
        setError(err.message)
      });
  }


  return (
    <>
      {/* <div className="container mx-auto px-4 h-full">
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
      </div> */}

      <div className="login--section">
        <div className="mx-auto flex justify-center lg:items-center h-full">
          <form className="sm:w-4/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0" onSubmit={authenticate}>
            <div className="pt-6 px-2 flex flex-col items-center justify-center">
              <h3 className="login-text--big">Create a new Password</h3>
            </div>

            <div className="pt-4 items-center justify-center">
              <div className="login-text--small text-center mx-auto">Set your password</div>
            </div>

            <div className="mt-3 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <input required
                  type="text"
                  required
                  name="token"
                  onChange={updateField}
                  value={agent.token}
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  placeholder="Reset Code" />
              </div>

              <div className="flex flex-col mt-5">
                <input required
                  type="password"
                  required
                  name="password"
                  value={agent.password}
                  onChange={updateField}
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  placeholder="Set Password" />
              </div>

              <div className="flex flex-col mt-5">
                <input required
                 type="password"
                 required
                 name="c_password"
                 value={agent.c_password}
                 onChange={updateField}
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" 
                  placeholder="Confirm Code" />
              </div>

              <small className="text-red-400">{error}</small>
            </div>

            <div className="px-2 sm:px-6 mt-4">
              <input onClick={authenticate} className="focus:outline-none w-full bg-green-600 transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big" type="submit"
                disabled={isLoading}
                value={isLoading == true ? "loading.." : "Set Password"} />
            </div>
          </form>
        </div>
      </div>
      <BottomSVG />
    </>
  );
}
Index.propTypes = {};
export default Index;
