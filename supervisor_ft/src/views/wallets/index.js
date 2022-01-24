import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userGroupIcon, userIcon } from "components/icons";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "features/authentication/authSlice";

Index.propTypes = {};

function Index({ profile }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let [winCode, setWinCode] = useState({
    code: "",
  });
  const [genCode, setgenCode] = useState("");
  const [fundAmt, setFundAmt] = useState(0);

  let getCode = (bank) => {
    setgenCode(
      "*" + bank + "*000*950+" + profile.refcode + "+" + fundAmt + "#"
    );
  };
  let [vtu, setVtu] = useState({
    phone: "",
    amount: 0,
    wallet: `w1${profile.id}`,
  });

  let [agentvtu, setAgentVtu] = useState({
    phone: "",
    amount: 0,
    wallet: `w1${profile.id}`,
  });

  const defaultWallet = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w1${profile.id}`,
    {
      headers: {
        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    }
  );

  const winningWallet = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w2${profile.id}`,
    {
      headers: {
        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    }
  );

  if (defaultWallet.error) {
    if (defaultWallet.error && defaultWallet.error.status == 401) {
    }
  }

  if (defaultWallet.error) {
    if (winningWallet.error && defaultWallet.error.status == 401) {
    }
  }

  const LoadWinningCode = () => {
    setIsLoading(true);
    setError("");
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/wincode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
      body: JSON.stringify(winCode),
    })
      .then((response) => {
        setIsLoading(false);

        if (!response.ok) {
          throw response;
        }
        response.json();
      })
      .then((data) => {
        alert("Account successfully funded");
        setWinCode("");
      })
      .catch((e) => {
        e.text().then((errorMessage) => {
          setError(errorMessage);
        });
      })
      .finally(() => {});
  };

  const sendVtu = () => {
    setIsLoading(true);
    setError("");
    let _vtu = vtu;
    if (!vtu.phone.startsWith("234")) {
      _vtu["phone"] = "234" + vtu.phone.substring(1);
    }
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/vtu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },

      body: JSON.stringify(_vtu),
    })
      .then(async (response) => {
        setIsLoading(false);
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());
        if (!response.ok) {
          const error = data  || response.statusText;
          return Promise.reject(error);
        }
        response.json();
      })
      .then((data) => {
        alert("VTU transfer sent");
      })
      .catch((e) => {
        setError(e.error);
      });
  };

  const sendAgentVtu = () => {
    setIsLoading(true);
    setError("");
    
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/agentvtu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },

      body: JSON.stringify(agentvtu),
    })
      .then(async (response) => {
        setIsLoading(false);
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const data = isJson && (await response.json());
        if (!response.ok) {
          const error = data  || response.statusText;
          return Promise.reject(error);
        }
        response.json();
        alert("VTU transfer sent");
      })
      .then(() => {
      })
      .catch((e) => {
        setError(e.error);
      });
  };
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Funded Wallet
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
                      ₦
                      {defaultWallet.data &&
                        defaultWallet.data.wallet.balance.toLocaleString(
                          "en-US",
                          {}
                        )}
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
                      ₦
                      {winningWallet.data &&
                        winningWallet.data.wallet.balance.toLocaleString(
                          "en-US",
                          {}
                        )}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      Balance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h5 className="text-lg text-gray-800 dark:text-gray-100 pb-3 font-semibold">
              Quick Actions
            </h5>
            <h5></h5>

            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Agent to Agent VTU
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  .
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
                    <input
                      onChange={(e) => {
                        setAgentVtu({ ...agentvtu, phone: e.target.value });
                      }}
                      placeholder="Phone Number"
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400 "
                    />
                    <input
                      onChange={(e) => {
                        setAgentVtu({ ...agentvtu, amount: Number(e.target.value) });
                      }}
                      type="Number"
                      placeholder="Amount"
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    />
                    <button
                      onClick={() => sendAgentVtu()}
                      className="m-2 bg-gray-800  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-100 px-6 py-2 text-sm"
                    >
                      Send
                    </button>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Agent to Player VTU
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  .
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
                    <input
                      onChange={(e) => {
                        setVtu({ ...vtu, phone: e.target.value });
                      }}
                      placeholder="Phone Number"
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400 "
                    />
                    <input
                      onChange={(e) => {
                        setVtu({ ...vtu, amount: Number(e.target.value) });
                      }}
                      type="Number"
                      placeholder="Amount"
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    />
                    <button
                      onClick={() => sendVtu()}
                      className="m-2 bg-gray-800  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-100 px-6 py-2 text-sm"
                    >
                      Send
                    </button>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Load Wining Code
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  .
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
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      Enter Winning code
                    </p>
                    <input
                      onChange={(e) => {
                        setError("");
                        setWinCode({ ...winCode, code: e.target.value });
                      }}
                      value={winCode.code}
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    />
                    <button
                      onClick={() => LoadWinningCode()}
                      className="m-2 bg-gray-800    hover:border-gray-500 hover:text-gray-50 rounded border border-gray-100 text-gray-100 px-6 py-2 text-sm"
                    >
                      Continue
                    </button>
                    <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 capitalize">
                  Fund With Bank
                </h4>
                <button className="my-2 bg-gray-100  hover:border-gray-500 hover:text-gray-600 rounded border border-gray-100 text-gray-800 px-6 py-2 text-sm">
                  .
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
                    <input
                      onChange={(e) => {
                        setFundAmt(e.target.value);
                      }}
                      placeholder="Amount"
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400 "
                    />

                    <form class="my-1 space-y-1" action="#" method="POST">
                      <div class="rounded-md shadow-sm space-y-2">
                        <div class="space-y-1">
                          <select
                            name="bank"
                            id="state"
                            required
                            onChange={(e) => getCode(e.target.value)}
                            class="mt-1 block  py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option disabled selected>
                              --Select Bank--
                            </option>
                            <option value="901">Access Bank</option>
                            <option value="901">Ecobank</option>
                            <option value="770">Fidelity Bank</option>
                            <option value="894">First Bank</option>
                            <option value="389*214">
                              First City Monument Bank (FCMB)
                            </option>
                            <option value="737">
                              Guaranty Trust Bank (GTB)
                            </option>
                            <option value="322*00">Heritage Bank</option>
                            <option value="7111">Keystone Bank</option>
                            <option value="providus">Providus Bank</option>
                            <option value="833">Stanbic IBTC Bank</option>
                            <option value="standard">
                              Standard Chartered Bank
                            </option>
                            <option value="822">Sterling Bank</option>
                            <option value="826">Union Bank</option>
                            <option value="919">
                              United Bank for Africa (UBA)
                            </option>
                            <option value="7799">Unity Bank</option>
                            <option value="945">Wema Bank</option>
                            <option value="966">Zenith Bank</option>
                          </select>
                        </div>

                        <div className="w-full  bg-gray-100 rounded-lg flex items-center justify-between p-4 mt-5">
                          <p className="text-base font-medium leading-6  dark:text-gray-100 text-gray-800 ">
                            {genCode}
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading show={isLoading} />
    </div>
  );
}
export default Index;

const Loading = ({ show, setShow }) => (
  <div className={show != true && "hidden"}>
    <div
      className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
      id="modal"
    >
      <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
        <div className="flex items-center justify-center py-8 px-4">
          <div className="flex md:w-80 rounded shadow-lg p-6 justify-center  dark:bg-gray-800 bg-white">
            <i class="fas fa-circle-notch fa-spin text-8xl text-gray-800"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
);
