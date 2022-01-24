import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import useFetch from "react-fetch-hook";
import { setAuthError } from "features/authentication/authSlice";
import { setAuthToken } from "features/authentication/authSlice";
import Header from '../../components/header'
import Stepper from "components/stepper";
import { Link } from 'react-router-dom';
import NaijaStates from 'naija-state-local-government';
import ReactPasswordToggleIcon from 'react-password-toggle-icon';
import Modal from '../../components/modal'

function Index({ setToken }) {
  const [stepIndex, setStepIndex] = useState(0)
  const dispatch = useDispatch();

  const [lg, setLG] = useState([]);

  const states = NaijaStates.states();

  let inputRef = useRef();
  const showIcon = () => <i className="fa fa-eye" aria-hidden="true"></i>
  const hideIcon = () => <i className="fa fa-eye-slash" aria-hidden="true"></i>

  const findLocalGovernment = (event) => {
    const lgas = NaijaStates.lgas(event.target.value)
    setLG(lgas.lgas)
  }

  let [agent] = useState({
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


  const [loginRandom] = useState();

  const { data, error } = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/signup`,
    {
      depends: [loginRandom],
      method: "POST",
      body: JSON.stringify(agent),
    }
  );
  if (data) {
    if (data.error) {
      dispatch(setAuthError(data.error));
    } else {
      dispatch(setAuthToken(JSON.stringify(data)));
    }
  }
  if (error) {
    dispatch(setAuthError("Unable to create your account! Try again" + error.message));
  }

  let form = useRef(null);
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const next = () => {
    let i = stepIndex;
    if (stepIndex >= 0 && stepIndex <= 2) {
      i = i + 1
      setStepIndex(i);
    }
  }

  return (
    <>
    <Modal visible={true} />
    
      <section className="login--section">
        <Header />
        <div className="mx-auto flex justify-center lg:items-center h-full">
          <form ref={form} onSubmit={handleSubmit} className="sm:w-4/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0">
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
                <div className="login-text--small">Start making the most out of Eliest Lotto, make money instantly today</div>
              </div>
            </>
            
            <Stepper index={stepIndex} />

            {stepIndex === 0 && <div className="mt-4 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5">
                <input id="firstname" name="firstname" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What is your first name?" required />
              </div>

              <div className="flex flex-col mt-5">
                <input id="lastname" name="lastname" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What is your last name?" required />
              </div>

              <div className="flex flex-col mt-5">
                <input placeholder="Type in your email address" required id="email" name="email" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="email" />
              </div>
            </div>}

            {stepIndex === 1 && <div className="mt-4 w-full px-2 sm:px-6">
              <div className="flex flex-col mt-5 relative block">
                <ReactPasswordToggleIcon className="pointer-events-none w-8 h-8 absolute top-1/2 transform -translate-y-1/2 right-3"
                  inputRef={inputRef}
                  showIcon={showIcon}
                  hideIcon={hideIcon}
                />
                <input ref={inputRef} id="password" name="password" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Set a password" required />
              </div>

              <div className="flex flex-wrap -mx-3">
                <div className="flex flex-col mt-5 w-full md:w-1/2 px-3 mb-6 md:mb-0 relative block">
                  <ReactPasswordToggleIcon className="pointer-events-none fix"
                    inputRef={inputRef}
                    showIcon={showIcon}
                    hideIcon={hideIcon}
                  />
                  <input id="confirm" ref={inputRef} name="confirm" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Confirm your password" required />
                </div>

                <div className="flex flex-col mt-5 w-full md:w-1/2 px-3">
                  <input id="referal" name="referal" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter your referral’s code" required />
                  <div className="max-w-sm mx-auto py-2">
                    <label className="inline-flex items-center checkbox--label">
                      <input className="checkbox text-gray-500 w-8 h-8 mr-2 focus:ring-green-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
                      I do not have a referral code
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="flex flex-col w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <div className="relative">
                    <select required className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="grid-state" placeholder="State of residence" onChange={findLocalGovernment}>
                      <option disabled value="null">Pick a State</option>
                      {states.map((state) => {
                        return <option value={state}>{state}</option>
                      })}

                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col w-full md:w-1/2 px-3">
                  <div className="relative">
                    <select required placeholder="LGA" className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="grid-state">
                      <option disabled value="null">Please pick a LGA</option>
                      {lg.map((l) => {
                        return (
                          <option value={l}>{l}</option>
                        );
                      })}
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
                <input id="city" name="city" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="What city are you from?" required />
              </div>

              <div className="flex flex-col mt-5">
                <textarea id="address" name="address" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter your address" required rows="3" />
              </div>

              <div className="flex mt-8 mb-4 ml-2">
                <label className="inline-flex items-center tc--label">
                  <input className="checkbox text-gray-500 w-8 h-8 mr-2 focus:ring-green-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
                  Terms &amp; conditions
                </label>
              </div>
            </div>}

            {stepIndex === 0 && <div className="text-center pt-4 create">
              <span>Already have an account?</span>
              <Link to="/login" className="create--link text-green-500">Sign in</Link>
            </div>}

            <div className="px-2 sm:px-6">
              <button onClick={next} className="focus:outline-none w-full bg-green-500 transition duration-150 ease-in-out hover:bg-green-700 rounded text-white px-8 py-3 text-sm mt-6 btn--big">{stepIndex === 2 ? 'Sign up' : 'Next'}</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
Index.propTypes = {};
export default Index;
