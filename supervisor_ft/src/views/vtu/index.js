import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";

function Index({ profile }) {
  const [ok, setOk] = useState(false);
  const [makeVoucherCall, setMakeVoucherCall] = useState(null);
  const [w, setW] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  let [values, setValues] = useState({
    phone: "",
    amount: 0,
    wallet: "",
    currentBal: 0,
  });
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  let history = useHistory();

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

  const getVtu = () => {
    setIsLoading(true);
    setError("")
    let _vtu = values
    if(!values.phone.startsWith("234")){
      _vtu["phone"] = "234" + values.phone.substring(1)
    }
    setValues({...values, phone: "234" + values.phone.substring(1)})
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/vtu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
      body: JSON.stringify(_vtu),
    })
      .then((response) => {
        setIsLoading(false);

        if (!response.ok) {
          throw response;
        }
        response.json();
      })
      .then((data) => {
        alert("VTU transfer sent");
      })
      .catch((e) => {
        e.text().then((errorMessage) => {
          setError(errorMessage);
        });
      });
  };

  let voucherProcess = (amount, count) => {
    let copyValues = { ...values };
    copyValues[amount] = count;
    setValues(copyValues);
  };

  useEffect(() => {
    setOk(true);
    if (Number(values["currentBal"]) < values["amount"]) {
      setOk(false);
    }
    if (values.wallet == "") {
      setOk(false);
    }
    return () => {};
  }, [values]);

  useEffect(() => {
    // console.log(w);
    if (w) setValues({ ...values, currentBal: w.balance, wallet: w.id });
    return () => {};
  }, [w]);

  return (
    <>
      {profile && !profile.account_verified ? (
        <Inactive />
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
            <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    getVtu();
                  }}
                  class="w-2/3 lg:w-1/2 flex justify-center bg-white dark:bg-gray-900 mx-auto shadow"
                >
                  {winningWallet.data && defaultWallet.data && (
                    <div class="w-full  text-gray-800 dark:text-gray-100 flex flex-col justify-center px-2 sm:px-0 py-16">
                      <div class="px-2 sm:px-6">
                        <h3 class="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">
                          Direct transfer to players
                        </h3>
                      </div>
                      <div class="mt-8 w-full px-2 sm:px-6">
                        <table class="w-full whitespace-nowrap">
                          <tbody>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>Phone Number</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="080 371 1111 111"
                                  name="phone"
                                  className="bg-gray-200 p-2"
                                  value={values["phone"]}
                                  onChange={(e) =>
                                    {
                                      voucherProcess("phone", e.target.value)}
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>Amount</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  name="amount"
                                  placeholder="100"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["amount"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess(
                                      "amount",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                        <div class="flex items-center bg-gray-800 text-gray-50 font-bold p-2 w-full rounded">
                          <p class="text-base">
                            Total Amount Due: {values["amount"]}
                          </p>
                        </div>
                      </div>
                      <div class="pt-6 w-full flex flex-col justify-between mx-2 sm:px-6">
                        <h4 className="mb-2 font-bold pb-2">
                          Choose wallet to charge
                        </h4>
                        <div
                          className=" flex items-center"
                          onClick={() => {
                            setMakeVoucherCall(null);
                            setW(defaultWallet.data.wallet);
                            console.log(values.wallet);
                          }}
                        >
                          <div className="cursor-pointer dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input
                              checked={
                                values["wallet"] == defaultWallet.data.wallet.id
                              }
                              type="radio"
                              name="radio"
                              className="checkbox appearance-none focus:outline-none  rounded-full border-gray-400 absolute cursor-pointer w-full h-full border-4 checked:border-none"
                            />
                            <div className="check-icon hidden border-4 border-indigo-700 flex items-center justify-center  rounded-full w-full h-full z-1">
                              <div className="bg-indigo-700 rounded-full w-2 h-2" />
                            </div>
                          </div>
                          <p className="ml-3 text-base font-medium leading-4  dark:text-gray-100 text-gray-800">
                            {" "}
                            ₦
                            {defaultWallet.data &&
                              defaultWallet.data.wallet.balance.toFixed(2).toLocaleString(
                                "en-US",
                                {}
                              )}
                            , Funded Wallet{" "}
                          </p>
                        </div>

                        <div
                          className="pb-7 pt-10 flex items-center"
                          onClick={() => {
                            setMakeVoucherCall(null);
                            setW(winningWallet.data.wallet);
                            console.log(values.wallet);
                          }}
                        >
                          <div className="cursor-pointer dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input
                              checked={
                                values["wallet"] == winningWallet.data.wallet.id
                              }
                              type="radio"
                              name="radio"
                              className="checkbox appearance-none focus:outline-none  rounded-full border-gray-400 absolute cursor-pointer w-full h-full border-4 checked:border-none"
                            />
                            <div className="check-icon hidden border-4 border-indigo-700 flex items-center justify-center  rounded-full w-full h-full z-1">
                              <div className="bg-indigo-700 rounded-full w-2 h-2" />
                            </div>
                          </div>
                          <p className="ml-3 text-base font-medium leading-4  dark:text-gray-100 text-gray-800">
                            {" "}
                            ₦
                            {winningWallet.data &&
                              winningWallet.data.wallet.balance.toFixed(2).toLocaleString(
                                "en-US",
                                {}
                              )}
                            , Winning Wallet
                          </p>
                        </div>
                        <p>{isLoading && "loading... "}</p>
                        <p></p>
                        <p>{error && error}</p>
                      </div>

                      <div class="flex px-2 sm:px-6 w-full justify-center">
                        <button
                          disabled={!ok}
                          type="submit"
                          class={
                            "self-center mx-auto focus:outline-none w-full sm:w-auto bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm mt-6 "
                          }
                        >
                          {ok
                            ? "Generate " + values["amount"]
                            : "Insufficient fund"}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Index;
