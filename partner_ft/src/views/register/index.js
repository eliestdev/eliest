import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginWithRegAsync } from "features/authentication/authSlice";
import { selectAuthError } from "features/authentication/authSlice";
import useFetch from "react-fetch-hook";
import { setAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import { useHistory } from "react-router-dom";
function Index({ setToken }) {
  const dispatch = useDispatch();
  const re_error = useSelector(selectAuthError);

  let [agent, setAgent] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    state: "",
    lg: "",
    city: "",
    password: "",
    cpassword: "",
    address: "",
  });

  const updateField = (e) => {
    setLoginRandom(null);

    setAgent({
      ...agent,
      [e.target.name]: e.target.value,
    });
  };

  let authenticate = (e) => {
    e.preventDefault();
    setLoginRandom(Math.random());
  };

  const [loginRandom, setLoginRandom] = useState();

  const { isLoading, data, error } = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/signup`,
    {
      depends: [loginRandom],
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agent),
    }
  );
  if (data) {
      if (data.error){
        dispatch(setAuthError(data.error));
      }else{
        dispatch(setAuthToken(JSON.stringify(data)));
      }
  }
  if (error) {
    dispatch(setAuthError("Unable to create your account! Try again" + error.message));    
   }

   let form = useRef(null);
   const handleSubmit = (event) => {
       event.preventDefault();
       const form_data = new FormData(form.current);
       let payload = {};
       form_data.forEach(function (value, key) {
           payload[key] = value;
       });
       //   console.log("payload", payload);
       // Place your API call here to submit your payload.
   };

  return (
    <>
    <section className="bg-indigo-600 {-- h-screen --}">
            <div className="mx-auto flex justify-center lg:items-center h-full">
                <form ref={form} onSubmit={handleSubmit} className="w-full sm:w-4/6 md:w-3/6 lg:w-4/12 xl:w-3/12 text-white py-12 px-2 sm:px-0">
                    <div className="pt-0 px-2 flex flex-col items-center justify-center">
                       
                        <h2 className="text-4xl leading-tight pt-8">Eliest</h2>
                    </div>
                    <div className="pt-16 px-2 flex flex-col items-center justify-center">
                        <h3 className="text-2xl sm:text-3xl xl:text-2xl font-bold leading-tight">Create a new Admin</h3>
                    </div>
                    <div className="mt-12 w-full px-2 sm:px-6">
                    <div className="flex flex-col mt-5">
                            <label htmlFor="username" className="text-lg font-semibold leading-tight">
                                Username
                            </label>
                            <input required id="username" name="username" className="h-10 px-2 w-full text-white bg-indigo-700 rounded mt-2 focus:outline-none shadow" />
                        </div>

                        <div className="flex flex-col mt-5">
                            <label htmlFor="email" className="text-lg font-semibold leading-tight">
                                Email
                            </label>
                            <input required id="email" name="email" className="h-10 px-2 w-full text-white bg-indigo-700 rounded mt-2 focus:outline-none shadow" type="email" />
                        </div>
                        <div className="flex flex-col mt-5">
                            <label htmlFor="password" className="text-lg font-semibold fleading-tight">
                                Password
                            </label>
                            <input required id="password" name="password" className="h-10 px-2 w-full text-white bg-indigo-700 rounded mt-2 focus:outline-none shadow" type="password" />
                        </div>
                    </div>
                    <div className="px-2 sm:px-6">
                        <button className="focus:outline-none w-full bg-white transition duration-150 ease-in-out hover:bg-gray-200 rounded text-indigo-600 px-8 py-3 text-sm mt-6">Create New</button>
                       
                    </div>
                </form>
            </div>
        </section>
    </>
  );
}
Index.propTypes = {};
export default Index;
