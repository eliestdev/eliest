import React, { useEffect, useState } from "react";
import { findWallet, getWallets, sendVtu, toBank, verifyNuban, winCode, withdrawNuban } from "./api";
import Loading from "components/Loading";
import { WalletIcon } from "./icons";
import { Link } from "react-router-dom";

function Index({ user }) {
  return (
    user ? <WalletsHome user={user} /> : (
      <p>No user</p>
    )
  )
}

function WalletsHome({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingNuban, setIsVerifyingNuban] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [playerVtuRes, setPlayerVtuRes] = useState("");
  const [agentVtuRes, setAgentVtuRes] = useState("");
  const [winCodeRes, setWinCodeRes] = useState("");
  const [transferResponse, setTransferResponse] = useState("");

  const [_winCode, setWinCode] = useState({
    code: ""
  });
  const [quickBank, setQuickBank] = useState({
    bank: "",
    amount: "",
    code: "",
    amount: 0
  });
  const [vtu01, setVtu01] = useState({
    "class": "01",
    "amount": 0.0,
    "phone": "",
    "wallet": ""
  });
  const [vtu02, setVtu02] = useState({
    "class": "02",
    "amount": 0.0,
    "phone": "",
    "wallet": ""
  });

  const [withdrawal, setWithdrawal] = useState({
    "recipient": "",
    "amount": 0.0,
    "bank": "",
    "nuban": "",
    "name": ""
  });

  let findVerifyWithdrawal = async () => {
    setIsVerifyingNuban(true)
    try {
      let response = await verifyNuban({ "nuban": withdrawal.nuban, "bank": withdrawal.bank })
      if (response.status !== "SUCCESS") {
        setTransferResponse(response.message)

      } else {
        console.log(response.data)
        setWithdrawal({ ...withdrawal, recipient: response.data.recipient, name: response.data.name })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsVerifyingNuban(false)
    }
  };

  let makeWithdrawal = async () => {
    setIsVerifyingNuban(true)
    try {
      let response = await withdrawNuban({ "amount": withdrawal.amount.toString(), "recipient": withdrawal.recipient, wallet: wallets[0].id })
      if (response.status !== "SUCCESS") {
        setTransferResponse(response.message)

      } else {
        setTransferResponse("Success!!! Your transfer is been processed.")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsVerifyingNuban(false)
    }
  };

  let findWallets = async (userId) => {
    setIsLoading(true)
    try {
      let response = await getWallets(userId)
      if (response.status !== "SUCCESS") {
      } else {
        setWallets(response.data.wallets)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let CallVtu = async (_vtu) => {
    const copyVtu = { ..._vtu }
    if (isNaN(copyVtu.amount)) {
      alert("Enter a valid number")
      return
    }
    if (copyVtu.class == "01") {
      copyVtu.phone = "234" + copyVtu.phone.slice(1)
    }
    setIsLoading(true)
    try {
      let response = await sendVtu(copyVtu)
      if (response.status !== "SUCCESS") { }
      else { }
      if (copyVtu.class == "01") {
        setPlayerVtuRes(response.message)
      }
      if (copyVtu.class == "02") {
        setAgentVtuRes(response.message)
      }
    } catch (error) {
      //alert(response.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };


  let acceptWinCode = async () => {
    setIsLoading(true)
    try {
      let response = await winCode(_winCode)
      if (response.status !== "SUCCESS") {
      } else {
      }
      setWinCodeRes(response.message)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let transferToBank = async (code) => {
    setIsLoading(true)
    try {
      let response = await toBank(code)
      if (response.status !== "SUCCESS") {
      } else {
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };


  useEffect(() => {
    findWallets(user.id)
    //CallVtu({"class":"02","amount":169,"phone":"43574674567","wallet":"b864b473-7f7d-4818-a217-daaeebd5fe7e"})
    return () => { };
  }, []);

  useEffect(() => {
    if (wallets.length > 0) {
      setVtu01({ ...vtu01, wallet: wallets[0].id })
      setVtu02({ ...vtu02, wallet: wallets[0].id })
    }
    return () => { };
  }, [wallets]);

  useEffect(() => {
    if (quickBank.bank != "") {
      setQuickBank({ ...quickBank, code: `*${quickBank.bank}*000*950+${user.profile.refcode}+${quickBank.amount}#` })
    }
    return () => { };
  }, [quickBank.bank, quickBank.amount]);

  return (
    <div className="flex flex-col items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded  my-3">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 m-2">
            {
              wallets.map(wallet => <WalletItem wallet={wallet} />)
            }
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3 bg-gray-100 mx-auto my-2 p-3 rounded">
        <h3 class="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">Quick Actions</h3>
      </div>

      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white mt-5">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 m-2">

            {/* Inner Item*/}
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Recharge Players</h4>
                <select className="text-xs bg-transparent text-gray-200 border border-gray-300 rounded px-2" onChange={(e) => { setVtu01({ ...vtu01, wallet: e.target.value }) }}>
                  {wallets.map(wallet => <option value={wallet.id}>{wallet.title}</option>)}
                </select>

              </div>
              <div className="flex justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex w-full flex-col">
                  <div className="flex space-x-1 w-full">
                    <input
                      placeholder="Phone Number"
                      value={vtu01.phone}
                      onChange={(e) => { setVtu01({ ...vtu01, phone: e.target.value }) }}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />

                    <input
                      placeholder="Amount"
                      value={vtu01.amount}
                      onChange={(e) => { setVtu01({ ...vtu01, amount: Number(e.target.value) }) }}
                      type="number"
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    <button className="p-2 bg-gray-800 text-gray-100 rounded text-sm shadow" onClick={() => { setVtu01({ ...vtu01, class: "01" }); CallVtu(vtu01) }}>Send</button>
                  </div>
                  {playerVtuRes != "" && <p className="text-xs text-red-800 text-center mt-2">{playerVtuRes}</p>}
                </div>
              </div>
            </div>

            {/* Inner Item*/}
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Transfer to agent</h4>

                <select className="text-xs bg-transparent text-gray-200 border border-gray-300 rounded px-2" onChange={(e) => { setVtu02({ ...vtu02, wallet: e.target.value }) }}>
                  {wallets.map(wallet => <option value={wallet.id}>{wallet.title}</option>)}
                </select>

              </div>
              <div className="flex justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex w-full flex-col">
                  <div className="flex space-x-1 w-full">
                    <input
                      placeholder="Phone Number"
                      value={vtu02.phone}
                      onChange={(e) => { let prePhone = e.target.value; setVtu02({ ...vtu02, phone: prePhone }) }}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />

                    <input
                      placeholder="Amount"
                      value={vtu02.amount}
                      onChange={(e) => { setVtu02({ ...vtu02, amount: Number(e.target.value) }) }}
                      type="number"
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    <button className="p-2 bg-gray-800 text-gray-100 rounded text-sm shadow" onClick={() => { setVtu02({ ...vtu02, class: "02" }); CallVtu(vtu02) }}>Send</button>
                  </div>
                  {agentVtuRes != "" && <p className="text-xs text-red-800 text-center mt-2">{agentVtuRes}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white mt-5">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 m-2">
            {/* Inner Item*/}
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Fund Wallet</h4>
              </div>
              <div className="flex flex-col justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex w-full">
                  <div className="flex space-x-1 w-full">
                    <select className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" onChange={(e) => setQuickBank({ ...quickBank, bank: e.target.value })}>
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

                    <input
                      placeholder="Amount"
                      type="number"
                      onChange={(e) => setQuickBank({ ...quickBank, amount: Number(e.target.value) })}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                  </div>
                </div>
                {quickBank.code != "" && <p className="text-xs text-red-800 text-center mt-2">{quickBank.code}</p>}

              </div>
            </div>

            {/* Inner Item*/}
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Accept winning code</h4>
              </div>
              <div className="flex flex-col justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex w-full">
                  <div className="flex space-x-1 w-full">
                    <input
                      placeholder="Enter Code"
                      value={_winCode.code}
                      onChange={(e) => { setWinCode({ ..._winCode, code: e.target.value }) }}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    <button className="p-2 bg-gray-800 text-gray-100 rounded text-sm shadow" onClick={() => acceptWinCode()}>continue</button>
                  </div>
                </div>
                {winCodeRes != "" && <p className="text-xs text-red-800 text-center mt-2">{winCodeRes}</p>}

              </div>
            </div>

          </div>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white mt-5">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8 m-2">
            {/* Inner Item*/}
            <div className="bg-white dark:bg-gray-800 rounded shadow">
              <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
                <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">Bank Withdrawal </h4>
              
                <div className="self-center text-gray-100">
                      {isVerifyingNuban && <i class="fas fa-spinner fa-pulse"></i>}
                    </div>
                    <select className="text-xs bg-transparent text-gray-200 border border-gray-300 rounded px-2" onChange={(e) => { setVtu02({ ...vtu02, wallet: e.target.value }) }}>
                  <option value="">winning wallet</option>
                </select>
              </div>
              <div className="flex justify-between w-full sm:w-full my-5 px-6 ">
                <div className="flex flex-col w-full">
                  <div className="flex space-x-1 w-full">
                    <select className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" onChange={(e) => setWithdrawal({ ...withdrawal, bank: e.target.value })}>
                      <option defaultValue="">Bank</option>
                      <option value="050">Ecobank</option>
                      <option value="011">First Bank</option>
                      <option value="058">Guaranty Trust Bank (GTB)</option>
                      <option value="030">Heritage Bank</option>
                      <option value="082">Keystone Bank</option>
                      <option value="221">Stanbic IBTC Bank</option>
                      <option value="232">Sterling Bank</option>
                      <option value="215">Unity Bank</option>
                      <option value="035">Wema Bank</option>
                      <option value="057">Zenith Bank</option>

                    </select>

                    <input
                      placeholder="Account Number"
                      value={withdrawal.nuban}
                      onChange={(e) => setWithdrawal({ ...withdrawal, nuban: e.target.value })}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    
                    <button className="p-2 bg-gray-800 text-gray-100 rounded text-sm shadow" onClick={() => findVerifyWithdrawal()}>

                      Verify</button>
                  </div>
                  <div className="flex space-x-1 w-full my-2" >
                    <input
                      placeholder="Account Number"
                      value={withdrawal.name}
                      disabled
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    <input
                      placeholder="Enter Amount"
                      type="number"
                      value={withdrawal.amount}
                      onChange={(e) => setWithdrawal({ ...withdrawal, amount: Number(e.target.value) })}
                      className="border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                    />
                    <button disabled={withdrawal.recipient === ""} className="p-2 bg-gray-800 text-gray-100 rounded text-sm shadow" onClick={()=> makeWithdrawal()}>Continue</button>
                  </div>
                  {transferResponse != "" && <p className="text-xs text-red-800 text-center mt-2">{transferResponse}</p>}

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


const WalletItem = ({ wallet }) => {
  const [detail, setDetail] = useState(null);
  const [tinyLoading, setTinyLoading] = useState(false);
  let getWallet = async (walletId) => {
    setTinyLoading(true)
    try {
      let response = await findWallet(walletId)
      if (response.status !== "SUCCESS") {
      } else {
        let query = response.data.walletquery
        console.log(query)
        setDetail(query)
      }
    } catch (error) {
      setDetail(null)
    } finally {
      setTinyLoading(false)
    }
  };


  useEffect(() => {
    getWallet(wallet.id)
    return () => { };
  }, []);

  return (wallet && (
    <div className="bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex flex-row justify-between bg-gray-900 px-6 items-center">
        <h4 className="text-base text-gray-100 dark:text-gray-400 font-bold tracking-normal leading-5 p-2 m-1 capitalize">{wallet.title} </h4>
      </div>
      <Link to={{ pathname: "/agent/wallet/" + wallet.id, state: { wallet: detail } }} >
        <div className="flex items-center justify-between w-full sm:w-full my-5 px-6 ">
          <div className="flex items-center">
            <div className="p-4 bg-blue-200 rounded-lg">
              <WalletIcon />
            </div>
            <div className="ml-6">
              {wallet.id && <h3 className="mb-1 leading-5 text-gray-800 dark:text-gray-100 font-bold text-2xl">
                ₦ {detail && detail.balance}   {tinyLoading && <i class="fas fa-spinner fa-pulse"></i>} </h3>}
              <p className="text-gray-600 dark:text-gray-400 text-sm tracking-normal font-normal leading-5">
                Balances
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  ))
}

