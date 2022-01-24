import React, { useState } from "react";
import PropTypes from "prop-types";
import { userGroupIcon, userIcon } from "components/icons";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "features/authentication/authSlice";

Index.propTypes = {};

function Index({profile}) {

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  
  const defaultWallet = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w1${profile.id}`, {
    headers:{
        "Authorization": "Bearer " + JSON.parse(token).access_token
    }
});

const winningWallet = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w2${profile.id}`, {
  headers:{
      "Authorization": "Bearer " + JSON.parse(token).access_token
  }
});

if(defaultWallet.error){
  if(defaultWallet.error && defaultWallet.error.status == 401){

  }
}

if(defaultWallet.error){
  if(winningWallet.error && defaultWallet.error.status == 401){

  }
}

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  My Wallet
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  Transactions
                </button>
              </div>
              <div className="flex items-center justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-200 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="mb-1 leading-5 text-gray-800 dark:text-gray-100 font-bold text-2xl">
                    ₦{defaultWallet.data && defaultWallet.data.wallet.balance.toLocaleString('en-US', {})}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      Balance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Winning Wallet
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  View History
                </button>
              </div>
              <div className="flex items-center justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex items-center">
                  <div className="p-4 bg-blue-200 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="mb-1 leading-5 text-gray-800 dark:text-gray-100 font-bold text-2xl">
                    ₦{winningWallet.data && winningWallet.data.wallet.balance.toLocaleString('en-US', {})}

                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      Balance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Index;
