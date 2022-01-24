import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";
import { getWallets } from "views/wallets/api";
import { findWallet } from "views/wallets/api";
import { WalletIcon } from "views/wallets/icons";

function Index({ user }) {
  const { profile } = user
  return (
    profile.account_verified ? <GenerateVoucherHome profile={profile} /> : <Inactive />
  )
}

function GenerateVoucherHome({ profile }) {

  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [discountedCost, setDiscountedCost] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  const [discount, setDiscount] = useState(20);
  const [wallets, setWallets] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [tinyLoading, setTinyLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(false);

  let [values, setValues] = useState({
    "50": 0,
    "100": 0,
    "200": 0,
    "500": 0,
    "1000": 0,
    "2000": 0,
    "wallet": "",
    "length": 12,
  });

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  let history = useHistory();


  let findWallets = async (userId) => {
    setIsLoading(true)
    try {
      let response = await getWallets(userId)
      if (response.status != "SUCCESS") {
      } else {
        setWallets(response.data.wallets)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let getWallet = async (walletId) => {
    setTinyLoading(true)
    try {
      let response = await findWallet(walletId)
      if (response.status != "SUCCESS") {
      } else {
        let query = response.data.walletquery
        setSelectedWallet(query)
      }
    } catch (error) {
      setSelectedWallet(null)
    } finally {
      setTinyLoading(false)
    }
  };


  useEffect(() => {
    findWallets(profile.id)
    return () => { };
  }, []);


  useEffect(() => {
    let disable = true

    let total =
      values["50"] * 50 +
      values["100"] * 100 +
      values["200"] * 200 +
      values["500"] * 500 +
      values["1000"] * 1000 +
      values["2000"] * 2000;
    let totalDue = total - (total * discount / 100)
    setTotalDue(totalDue);
    setDiscountedCost(totalDue);
    setTotalCost(total);

    if (selectedWallet && selectedWallet.balance > totalDue) {
      disable = false
    }
    if (total == 0) {
      disable = true
    }
    setDisable(disable)

  }, [values, selectedWallet]);




  useEffect(() => {
    fetch("https://closeadmin.eliestlotto.biz/settings/getvoucherlength")
      .then((response) => response.json())
      .then((data) => {
        //setValues({ ...values, length: Number(data) });
      }).catch(() => {
        //setValues({ ...values, length: 11 });
      });
    return () => { };
  }, []);

  useEffect(() => {
    fetch("https://closeadmin.eliestlotto.biz/settings/getvoucherdiscount")
      .then((response) => response.json())
      .then((data) => {
        // setDiscount(Number(data));
      }).catch(() => {
        // setDiscount(Number(20));
      });
    return () => { };
  }, []);

  let myShows = [10, 11, 12, 13];

  const getVoucher = async () => {

    let show = myShows[Math.floor(Math.random() * myShows.length)];

    setIsLoading(true)
    let updatedValue = { ...values, length: show };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': "Bearer " + JSON.parse(token).access_token, },
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

  let voucherProcess = (amount, count) => {
    let copyValues = { ...values }
    if (amount == "walletId") {
      copyValues.wallet = count
      setValues(copyValues)
      return
    }
    copyValues[amount] = Number(count)
    setValues(copyValues)
  };


  return (
    <>
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
          <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
            <div className="mt-5 md:mt-0">
              <form
                onSubmit={(e) => { e.preventDefault(); getVoucher() }}
                className="w-full flex justify-center bg-white dark:bg-gray-900 mx-auto p-3"
              >
                <div class="w-full  text-gray-800 dark:text-gray-100 flex flex-col justify-center px-2 sm:px-0">
                  <div class="px-2 sm:px-6">
                    <h3 class="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">Generate new vouchers </h3>
                  </div>
                  <div class="mt-8 w-full px-2 sm:px-6">
                    <table class="w-full whitespace-nowrap">
                      <thead>
                        <tr className="text-left bg-gray-800 text-white p-3">
                          <th className="text-left p-3">  <strong>Amount (Naira)</strong>  </th>
                          <th> <strong>How Many</strong>  </th> </tr>
                      </thead>
                      <tbody>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>50</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input placeholder="10"
                              className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["50"]} min="0"
                              onChange={(e) => voucherProcess("50", e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>100</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input
                              placeholder="10" className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["100"]}
                              min="0" onChange={(e) => voucherProcess("100", e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>200</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input
                              placeholder="10" className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["200"]}
                              min="0" onChange={(e) => voucherProcess("200", e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>500</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input
                              placeholder="10" className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["500"]}
                              min="0" onChange={(e) => voucherProcess("500", e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>1000</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input
                              placeholder="10" className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["1000"]}
                              min="0" onChange={(e) => voucherProcess("1000", e.target.value)}
                            />
                          </td>
                        </tr>
                        <tr className="border py-2">
                          <td className="py-2 px-2">
                            <p>2000</p>
                          </td>
                          <td className="py-2 px-2 self-center">
                            <input
                              placeholder="10" className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                              type="Number" value={values["2000"]}
                              min="0" onChange={(e) => voucherProcess("2000", e.target.value)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                    <div class="flex items-center justify-between bg-gray-800 text-gray-50 font-bold p-3 w-full">
                      <p class="text-base">Total Amount Due:</p>
                      <p> {totalDue}</p>
                    </div>
                  </div>



                  <div class="pt-6 w-full flex flex-col justify-between  sm:px-6">
                    <h4 className="mb-2 font-bold pb-2">
                      Choose wallet to charge
                    </h4>

                    {wallets.map(wallet =>
                      <div
                        className={"cursor-pointer flex items-center  my-2 p-3 " + (values.wallet === wallet.id ? "shadow bg-green-100" : "bg-gray-50")}
                        onClick={() => { voucherProcess("walletId", wallet.id); getWallet(wallet.id) }}  >
                        <p className="self-center ml-3 text-lg leading-4  dark:text-gray-100 text-gray-800">
                          <WalletIcon /> {wallet.title}
                        </p>
                      </div>
                    )}

                    <div class="pt-6 w-full flex justify-between px-2 sm:px-6">
                      <div class="flex items-center justify-between  text-gray-800 font-bold w-full">
                        <p class="text-base"></p>
                        <p className="text-2xl font-extralight"> {tinyLoading && <i class="fas fa-spinner fa-pulse"></i>} {selectedWallet.balance}</p>
                      </div>
                    </div>

                    <p>{isLoading && "loading... "}</p>
                    <p>{error && error}</p>

                  </div>

                  <div class="flex px-2 sm:px-6 w-full justify-center">
                    <button
                      disabled={disable}
                      type="submit"
                      onClick={() => alert(JSON.parse(values))}
                      class={"font-bold self-center mx-auto  w-full sm:w-auto bg-gray-800  rounded text-white px-8 py-2 text-sm mt-6"} >
                      {disable ? "Invalid Request" : "Generate " + totalCost}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
export default Index;
