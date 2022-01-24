import React, { useEffect, useLayoutEffect, useState } from "react";
import { getValues, getWallet, activateSupervisor } from "./api";

Index.propTypes = {};

function Index({ profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [values, setValues] = useState({});

  const [wallet, setWallet] = useState(null);

  let loadParams = async () => {
    setIsLoading(true)
    try {
      let response = await getValues()
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        setValues(response.data)
        const res = await getWallet()
        setWallet(res.data.walletquery)
        // window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadParams()
    return () => {

    };
  }, []);

  useEffect(() => {
    setQuickBank({ ...quickBank, amount: values["201"] })
    return () => { };
  }, [values]);

  const [quickBank, setQuickBank] = useState({
    bank: "",
    amount: "",
    code: "",
    amount: 1000
  });

  useEffect(() => {
    if (quickBank.bank != "") {
      setQuickBank({ ...quickBank, code: `*${quickBank.bank}*000*950+${profile.refcode}+${quickBank.amount}#` })
    }
    return () => { };
  }, [quickBank.bank, quickBank.amount]);

  const activateAccount = async () => {
    try {
      setIsLoading(true);
      const res = await activateSupervisor()
      alert(res.message)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="flex items-center justify-center py-8 px-4">
            <div className="md:w-full rounded-md shadow-lg p-5 dark:bg-gray-800 bg-white">

              <div className="bg-white dark:bg-gray-800 rounded shadow">
                <div className="p-2 text-sm">
                  <p>Choose your bank</p>
                  <p>Dial the code to pay the activation fee</p>
                  <p>NB: Your account would not be activated if you dial wrong code</p>
                </div>

                <div className="flex flex-row justify-between bg-green-500 px-6 items-center">
                  <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Fund Wallet for activation</h4>
                  {wallet != null && <span className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Bal: N{values["201"]}</span>}
                </div>
                <div className="flex flex-col justify-between w-full sm:w-full my-5 px-6 pb-5">
                  <div className="text-green-500 mb-2">Note: Activation fee is N{values["201"]}</div>
                  <div className="flex w-full">
                    <div className="flex space-x-1 w-full">
                      <select className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" onChange={(e) => setQuickBank({ ...quickBank, bank: e.target.value, code: `*${e.target.value}*000*950+${profile.refcode}+${quickBank.amount}#` })}>
                        <option defaultValue="">Bank</option>
                        <option value="901">Access Bank</option>
                        <option value="901">Ecobank</option>
                        <option value="770">Fidelity Bank</option>
                        <option value="894">First Bank</option>
                        <option value="389*214"> First City Monument Bank (FCMB)  </option>
                        <option value="737">Guaranty Trust Bank (GTB)</option>
                        <option value="322*00">Heritage Bank</option>
                        <option value="7111">Keystone Bank</option>
                        <option value="833">Stanbic IBTC Bank</option>
                        <option value="822">Sterling Bank</option>
                        <option value="826">Union Bank</option>
                        <option value="919">  United Bank for Africa (UBA)   </option>
                        <option value="7799">Unity Bank</option>
                        <option value="945">Wema Bank</option>
                        <option value="966">Zenith Bank</option>
                      </select>
                    </div>
                  </div>
                  {quickBank.code != "" && <p className="text-xs text-red-800 text-center mt-2">{quickBank.code}</p>}
                </div>
              </div>
              <button onClick={activateAccount} disabled={isLoading} className="bg-green-500 text-white rounded px-3 py-2">{!isLoading ? "Verify and Activate Account" : "loading..."}</button>
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
    <div className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
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
