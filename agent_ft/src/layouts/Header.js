import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import { activate } from './api';

const Header = ({ user }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [tinyLoading, setTinyLoading] = useState(false);

  let loadActivate = async () => {
    setTinyLoading(true)
    setIsLoading(true)
    try {
      let response = await activate()
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setTinyLoading(false)
      setIsLoading(false)
    }
  };


  const dispatch = useDispatch();
  const { profile } = user
  return (
    <div className="relative z-10 bg-gray-800 pt-8 pb-16">
      <div className="container px-6 mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold leading-tight text-white">
            {profile && profile.firstname} {profile && profile.lastname}
          </h4>
        </div>
        <div className="mt-6 lg:mt-0">
          {(profile && !profile.account_verified) &&
            <button className="focus:outline-none mr-3 bg-red-700  hover:bg-gray-700 rounded text-white px-5 py-2 text-sm border border-white"
              onClick={() => {
                loadActivate();
              }} >
                {tinyLoading && <i class="fas fa-spinner fa-pulse"></i>}
              Activate Account
            </button>
          }      
          <button className="focus:outline-none transition duration-150 ease-in-out hover:bg-gray-200 border bg-white rounded text-indigo-700 px-8 py-2 text-sm"
            onClick={(e) => {
              e.preventDefault();
              dispatch(removeAuthToken());
              dispatch(setAuthError(""));
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
