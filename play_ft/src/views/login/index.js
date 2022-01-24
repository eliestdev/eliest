import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from '../../components/header'
import './login.css'
import { SignInWithUSSD } from '../../api/fetch'
import Banner from '../../components/banner'
import BottomSVG from "components/bottomsvg";
import { useDispatch } from "react-redux";
import { setAuthToken } from "features/authentication/authSlice";

function Index() {
  const history = useHistory();
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  let [user, setUser] = useState({
    msisdn: "",
    pin: "",
  });

  const updateField = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  let form = useRef(null);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await SignInWithUSSD(user.msisdn, user.pin);
      const data = await res.json()
      if (data.status === "SUCCESS") {
        dispatch(setAuthToken(data.data.access_token))
        history.push("/play/games");
      } else {
        setData(data);
      }
    } catch (e) {
      setData("Something went wrong! Try again");
    }
  };

  return (
    <>
      <section className="login--section">
        <Header />
        {data && <Banner data={data} type="error" />}
        <div className="md:mx-auto md:flex md:justify-center lg:items-center md:h-full">
          <form ref={form} onChange={updateField} onSubmit={handleSubmit} className="sm:w-6/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0">
            <div className="px-6 flex flex-col items-center justify-center">
              <h3 className="login-text--big">Sign in to your player account</h3>
            </div>

            <div className="pt-10 md:pt-24 items-center justify-center">
              <div className="login-text--small">We’ve missed you, start winning big from all our available games.</div>
            </div>

            <div className="mt-4 w-full px-6 md:px-2">
              <div className="flex flex-col mt-5">
                <input required id="phone" name="msisdn" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="inline-full-name" type="text" placeholder="Enter your phone number" />
              </div>
              <div className="flex flex-col mt-5">
                <input required id="password" name="pin" className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="password" placeholder="Enter your year of birth" />
              </div>
            </div>
            <div className="pt-6 sm:pt-2 w-full flex justify-between px-6 sm:px-6">
              <div className="flex items-center">

              </div>
              <span className="text-xs forgot">
                Forgot Password?
                <Link className="recover text-green-500" to="/recover">Recover</Link>
              </span>
            </div>

            <div className="text-center create">
              <span>Don’t have an account?</span>
              <Link className="create--link text-green-500" to=""> Dial *389*801# on any phone to get started</Link>
            </div>

            <div className="px-6 sm:px-6">
              <button className="focus:outline-none w-full bg-green-600 transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big" onClick={handleSubmit}>Sign in</button>
            </div>
          </form>
        </div>
      </section>
      <BottomSVG />
    </>
  );
}


export default Index;
