import React, { useState, useEffect, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import NaijaStates from "naija-state-local-government";
import { register } from "./api";
import { setAuthError } from "features/authentication/authSlice";
import Stepper from "components/stepper";
import ReactPasswordToggleIcon from 'react-password-toggle-icon';

function Index({ setToken }) {
  const dispatch = useDispatch();
  const re_error = useSelector(selectAuthError);
  const [isLoading, setIsLoading] = useState(false);

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

  const ngStates = NaijaStates.states();
  const [selectedState, setSelectedState] = useState("");
  const [lgs, setLGs] = useState([]);

  const updateField = (e) => {
    setAgent({
      ...agent,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (selectedState != "") {
      setLGs([...NaijaStates.lgas(selectedState).lgas]);
    } else {
      setLGs([]);
    }
    return () => { };
  }, [selectedState]);

  let authenticate = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      let response = await register(agent)
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

  const [stepIndex, setStepIndex] = useState(0)

  let inputRef = useRef();
  const showIcon = () => <i className="fa fa-eye" aria-hidden="true"></i>
  const hideIcon = () => <i className="fa fa-eye-slash" aria-hidden="true"></i>

  const next = () => {
    let i = stepIndex;
    if (stepIndex >= 0 && stepIndex <= 1) {
      i = i + 1
      setStepIndex(i);
    }
  }

  return (
    <>
      {/* <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-5/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-gray-900 border-0">
              <form onSubmit={authenticate}>
                <div className="flex-auto px-4 lg:px-10 py-10 pb-3 pt-0">
                  <div className="text-green-200 text-center mb-3 font-bold pt-5 text-base">
                    <p class="my-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-100 sm:text-4xl">
                      Eliest Lotto
                    </p>
                    <h5>Become a Supervisor</h5>
                  </div>
                  <div className="relative w-full mb-3">
                    <div class="grid grid-cols-6 gap-6 my-3">
                      <div class="col-span-6 sm:col-span-3">
                        <label  for="firstname"  className="block uppercase text-green-200 text-xs font-bold mb-2">
                          First name
                        </label>
                        <input type="text"  value={agent.firstname}
                          required   onChange={updateField}   name="firstname"
                          id="firstname"  autocomplete="given-name"   placeholder="Enter your first name"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <label  for="lastname"   className="block uppercase text-green-200 text-xs font-bold mb-2">
                          Last name
                        </label>
                        <input  type="text"   value={agent.lastname}  onChange={updateField}  required
                          name="lastname"   id="lastname"  autocomplete="family-name"   placeholder="Last name"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-6 gap-6 my-3">
                      <div class="col-span-6 sm:col-span-3">
                        <label  for="email"  className="block uppercase text-green-200 text-xs font-bold mb-2">
                          Email
                        </label>
                        <input  type="email"   value={agent.email}   onChange={updateField}
                          required  name="email"    id="email"  autocomplete="email address"  placeholder="Email Address"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <label  for="name"   className="block uppercase text-green-200 text-xs font-bold mb-2"   >
                          Phone Number
                        </label>
                        <input
                          type="text"  name="phone"     id="phone"
                          value={agent.phone}    onChange={updateField}     required   placeholder="Enter phone number"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <label
                          for="name"
                          className="block uppercase text-green-200 text-xs font-bold mb-2"
                        >
                          Set a password
                        </label>
                        <input
                          type="password" name="password"    id="password"  minLength={4}
                          autocomplete="password"   value={agent.password}
                          onChange={updateField}   required
                          placeholder="Set a password"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>
                      <div class="col-span-6 sm:col-span-3">
                        <label
                          for="name"
                          className="block uppercase text-green-200 text-xs font-bold mb-2"
                        >
                          Confirm your password
                        </label>
                        <input
                          type="password"
                          name="cpassword"
                          id="cpassword"
                          minLength={4}
                          autocomplete="password"
                          value={agent.cpassword}
                          onChange={updateField}
                          required
                          placeholder="Confirm Password"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>

                     
                  
                    </div>

                    <div class="relative w-full mb-3">
                      <label
                        for="state"
                        class="block text-sm font-medium text-green-200"
                      >
                        State
                      </label>
                      <select
                        name="state"
                        id="state"
                        onChange={(e) => {
                          updateField(e);
                          setSelectedState(e.target.value);
                        }}
                        onSelect={(e) => {
                          alert("");
                          setSelectedState(e.target.value);
                        }}
                        required
                        autocomplete="state"
                        class="mt-1 block w-full py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option disabled selected>
                          --Select State--
                        </option>
                        {ngStates.map((state) => (
                          <option value={state}>{state}</option>
                        ))}{" "}
                      </select>
                    </div>

                    <div class="grid grid-cols-6 gap-6 my-3">
                      <div class="col-span-6 sm:col-span-3">
                        <label
                          for="city"
                          className="block uppercase text-green-200 text-xs font-bold mb-2"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          value={agent.city}
                          onChange={updateField}
                          required
                          name="city"
                          id="city"
                          autocomplete="given-name"
                          placeholder="City"
                          className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        />
                      </div>

                      <div class="col-span-6 sm:col-span-3">
                        <label
                          for="city"
                          className="block uppercase text-green-200 text-xs font-bold mb-2"
                        >
                          Local Government
                        </label>
                        <select
                          name="lg"
                          id="lg"
                          onChange={updateField}
                          onSelect={updateField}
                          className="mt-1 block w-full py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="" defaultValue>
                            Select Local Gov
                          </option>
                          {lgs.map((lg) => (
                            <option value={lg}>{lg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-green-200 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Address{" "}
                    </label>
                    <textarea
                      type="text"
                      required
                      name="address"
                      value={agent.address}
                      onChange={updateField}
                      className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Address"
                    ></textarea>
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        required
                        className="form-checkbox border-0 rounded text-green-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-green-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          privacy policy{" "}
                        </a>
                      </span>
                    </label>
                  </div>
                  <small className="text-red-400">{re_error}</small>

                  <div className="text-center mt-6">
                    <button
                      disabled={isLoading}
                      className="bg-green-800 text-white active:bg-green-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      {isLoading == true ? "loading.." : "Register"}
                    </button>
                  </div>
                  <div className="w-full text-center mt-2">
                    <Link to="/auth/login" className="text-green-200">
                      <small>I am already an supervisor</small>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

<section className="login--section">
        <div className="mx-auto flex justify-center lg:items-center h-full">
          <form className="sm:w-4/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0" onSubmit={authenticate}>
            <>
              {stepIndex === 0 && <div className="pt-4 px-2 flex flex-col items-center justify-center">
                <h3 className="login-text--big">Create an account</h3>
              </div>
              }

              {stepIndex === 1 && <div className="pt-4 px-2 flex flex-col items-center justify-center">
                <h3 className="login-text--big">We’re almost done</h3>
              </div>
              }

              {stepIndex === 2 && <div className="pt-4 px-2 flex flex-col items-center justify-center">
                <h3 className="login-text--big">Finally, last lap</h3>
              </div>
              }

              <div className="pt-6 items-center justify-center">
                <div className="login-text--small text-center mx-auto">Start making the most out of Eliest Lotto, make money instantly today</div>
              </div>
            </>

            <Stepper index={stepIndex} />

            <small className="text-red-400">{re_error}</small>

            {stepIndex === 0 && <div className="mt-4 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <input value={agent.firstname}
                  required
                  onChange={updateField}
                  name="firstname"
                  id="firstname"
                  autocomplete="given-name" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What is your first name?" />
              </div>

              <div className="flex flex-col mt-5">
                <input value={agent.lastname}
                  onChange={updateField}
                  required
                  name="lastname"
                  id="lastname"
                  autocomplete="family-name"
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What is your last name?" />
              </div>

              <div className="flex flex-col mt-5">
                <input placeholder="Type in your email address" required className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="email" value={agent.email}
                  onChange={updateField}
                  required
                  name="email"
                  id="email"
                  autocomplete="email address" />
              </div>
            </div>}

            {stepIndex === 1 && <div className="mt-4 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5 relative block">
                <ReactPasswordToggleIcon className="pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3"
                  inputRef={inputRef}
                  showIcon={showIcon}
                  hideIcon={hideIcon}
                />
                <input ref={inputRef} className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Set a password" name="password"
                  id="password"
                  autocomplete="password"
                  value={agent.password}
                  onChange={updateField}
                  required />
              </div>

              <div className="flex flex-wrap -mx-3">
                <div className="flex flex-col mt-5 w-full md:w-1/2 px-3 mb-6 md:mb-0 relative block">
                  <ReactPasswordToggleIcon className="pointer-events-none right--"
                    inputRef={inputRef}
                    showIcon={showIcon}
                    hideIcon={hideIcon}
                  />
                  <input ref={inputRef} className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Confirm your password" name="cpassword"
                    id="cpassword"
                    autocomplete="password"
                    value={agent.cpassword}
                    onChange={updateField} required />
                </div>

                <div className="flex flex-col mt-5 w-full md:w-1/2 px-3">
                  <input id="referer"
                    value={agent.referer}
                    name="referer"
                    onChange={updateField} className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter your referral’s code"  />
                  <div className="max-w-sm mx-auto py-2">
                    <label className="inline-flex items-start md:items-center checkbox--label">
                      <input className="checkbox text-gray-500 w-8 h-8 mr-2 focus:ring-green-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
                      I do not have a referral code
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <div className="relative">
                    <select name="state"
                      id="state"
                      onChange={(e) => {
                        updateField(e);
                        setSelectedState(e.target.value);
                      }}
                      onSelect={(e) => {
                        alert("");
                        setSelectedState(e.target.value);
                      }}

                      autocomplete="state" required className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="grid-state" placeholder="State of residence">
                      <option disabled selected>
                        State of residence
                      </option>
                      {ngStates.map((state) => (
                        <option value={state}>{state}</option>
                      ))}{" "}

                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col w-full md:w-1/2 px-3">
                  <div className="relative">
                    <select required name="lg"
                      id="lg"
                      onChange={updateField}
                      onSelect={updateField}
                      placeholder="LGA" className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                      <option disabled selected>
                        LGA
                      </option>
                      {lgs.map((lg) => (
                        <option value={lg}>{lg}</option>
                      ))}

                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>
              </div>

            </div>}

            {stepIndex === 2 && <div className="mt-4 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <input value={agent.city}
                  onChange={updateField}
                  name="city"
                  id="city"
                  autocomplete="given-name" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What city are you from?" required />
              </div>

              <div className="flex flex-col mt-5">
                <input value={agent.phone}
                  onChange={updateField}
                  name="phone"
                  id="phone"
                  autocomplete="given-phone" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Phone Number" required />
              </div>

              <div className="flex flex-col mt-5">
                <textarea
                  name="address"
                  value={agent.address}
                  onChange={updateField}
                  className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter your address" required rows="3" />
              </div>

              <div className="flex mt-8 mb-4 ml-2">
                <label className="inline-flex items-center tc--label">
                  <input required className="checkbox text-gray-500 w-8 h-8 mr-2 focus:ring-green-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
                  Terms &amp; conditions
                </label>
              </div>
            </div>}

            {stepIndex === 0 && <div className="text-center pt-4 create">
              <span>Already have an account?</span>
              <Link to="/login" className="create--link text-green-500">Sign in</Link>
            </div>}

            <div className="px-2 sm:px-6">
              
              <input type="submit" disabled={isLoading} onClick={next} className="focus:outline-none w-full bg-green-500 transition duration-150 ease-in-out hover:bg-green-700 rounded text-white px-8 py-3 text-sm mt-6 btn--big" value={stepIndex === 2 ? 'Sign up' : 'Next'}/>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
Index.propTypes = {};
export default Index;
