import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";

function Index({ profile }) {
  const [ok, setOk] = useState(false);

  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  let [values, setValues] = useState({
    "50": 0,
    "100": 0,
    "200": 0,
    "500": 0,
    "1000": 0,
    "2000": 0,
    "length":11,
    "currentBal":0
  });
  const [w, setW] = useState("");
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  let history = useHistory();

  const textChange = (e) => {
    let updatedValue = { ...values };
    updatedValue[e.target.name] = Number(e.target.value);

    setValues(updatedValue);
  };

  useEffect(() => {
    let total =
      values["50"] * 50 +
      values["100"] * 100 +
      values["200"] * 200 +
      values["500"] * 500 +
      values["1000"] * 1000 +
      values["2000"] * 2000;

    let totalDue = total - (total * discount/100)
    setTotalDue(totalDue);
    setTotalCost(total);
    return () => {};
  }, [values]);

  useEffect(() => {
    if(w){
    let updatedValue = { ...values };
    updatedValue["wallet"] = w;
    setValues(updatedValue);
  }else{
  }
    return () => {};
  }, [w]);

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

  useEffect(() => {
    fetch("https://closeadmin.eliestlotto.biz/settings/getvoucherlength")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data)
        setValues({ ...values, length: Number(data) });
      }).catch(()=>{
        setValues({ ...values, length: 11 });
      });
    return () => {};
  }, []);

  useEffect(() => {
    fetch("https://closeadmin.eliestlotto.biz/settings/getvoucherdiscount")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data)
        setDiscount(Number(data));
      }).catch(()=>{
        setDiscount(Number(20));
      });
    return () => {};
  }, []);



  const getVoucher = async () =>{
setIsLoading(true)
let updatedValue = { ...values };
updatedValue["wallet"] = w;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',  'Authorization': "Bearer " + JSON.parse(token).access_token,},
      body: JSON.stringify(updatedValue)
  };

  fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/buyvoucher`, requestOptions)
        .then(async response => {
          setIsLoading(false)

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            history.push("/agent/voucher_batches")
        })
        .catch(error => {
          setError(error.toString())
        });
  }
  

  let p = false;
  if (winningWallet.data && defaultWallet.data) {
    p =
      totalCost > 0 &&
      w != "" &&
      totalCost <
        Math.max(
          defaultWallet.data.wallet.balance,
          winningWallet.data.wallet.balance
        );
  }
  let voucherProcess = (amount, count) => {
    let copyValues = {...values}
    copyValues[amount] = Number(count)
    setValues(copyValues)
  };

  useEffect(() => {
    setOk(true);
    if (Number(values["currentBal"]) < totalCost) {
      setOk(false);
    }
    if ((values["wallet"] = "")) {
      setOk(false);
    }
    return () => {};
  }, [values]);

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
                    getVoucher()
                  }}
                  class="w-2/3 lg:w-1/2 flex justify-center bg-white dark:bg-gray-900 mx-auto shadow"
                >
                  {winningWallet.data && defaultWallet.data && (
                    <div class="w-full  text-gray-800 dark:text-gray-100 flex flex-col justify-center px-2 sm:px-0 py-16">
                      <div class="px-2 sm:px-6">
                        <h3 class="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">
                          Generate new vouchers
                        </h3>
                      </div>
                      <div class="mt-8 w-full px-2 sm:px-6">
                        <table class="w-full whitespace-nowrap">
                          <thead>
                            <tr>
                              <th className="text-left">
                                <strong>Amount (Naira)</strong>
                              </th>
                              <th>
                                <strong>How Many</strong>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>50</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["50"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("50", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>100</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["100"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("100", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>200</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["200"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("200", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>500</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["500"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("500", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>1000</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["1000"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("1000", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                            <tr className="border py-2">
                              <td className="py-2 px-2">
                                <p>2000</p>
                              </td>
                              <td className="py-2 px-2 self-center">
                                <input
                                  placeholder="10"
                                  className="bg-gray-200 p-2"
                                  type="Number"
                                  value={values["2000"]}
                                  min="0"
                                  onChange={(e) =>
                                    voucherProcess("2000", e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    
                      <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                        <div class="flex items-center bg-gray-800 text-gray-50 font-bold p-2 w-full rounded">
                          <p class="text-base">Total Amount Due: {totalDue}</p>
                        </div>
                      </div>
                      <div class="pt-6 w-full flex flex-col justify-between mx-2 sm:px-6">
                        <h4 className="mb-2 font-bold pb-2">
                          Choose wallet to charge
                        </h4>
                        <div
                          className=" flex items-center"
                          onClick={() => {
                            setW(defaultWallet.data.wallet.id);
                            setValues({...values, currentBal: defaultWallet.data.wallet.balance, wallet:defaultWallet.data.wallet.id});

                          }}
                        >
                          <div className="cursor-pointer dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input
                              checked={values.wallet == defaultWallet.data.wallet.id}
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
                              defaultWallet.data.wallet.balance.toLocaleString(
                                "en-US",
                                {}
                              )}
                            , Funded Wallet{" "}
                          </p>
                        </div>
                        <div
                          className="pb-7 pt-10 flex items-center"
                          onClick={() => {
                            setW(winningWallet.data.wallet.id);
                            setValues({...values, currentBal: winningWallet.data.wallet.balance, wallet:winningWallet.data.wallet.id});

                          }}
                        >
                          <div className="cursor-pointer dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input
                              checked={values.wallet == winningWallet.data.wallet.id}
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
                              winningWallet.data.wallet.balance.toLocaleString(
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
                          {ok ? "Generate " + totalCost : "Insufficient fund"}
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
