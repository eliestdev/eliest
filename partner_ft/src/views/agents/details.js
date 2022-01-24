import { data } from "autoprefixer";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { timeInUnix } from "utils";
import { agentFunding, findAgent, suspendAgent, unsuspendAgent } from "./api";

export default function Index(props) {
  const { id } = useParams();
  const [agent, setAgent] = useState({ profile: {}, wallets: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransaction] = useState([]);


  const [filter, setFilter] = useState({
    from: timeInUnix(0, 0, 0),
    to: timeInUnix(23, 59, 59)
  });

  const handleTimelineChange = (e, hour, min, sec) => {
    let init = 962641361;
    if (e.target.value) {
      init = new Date(e.target.value).setHours(hour, min, sec, 59);
    }
    let copyFilter = { ...filter }
    copyFilter[e.target.name] = Math.floor(init / 1000)
    setFilter(copyFilter);
  }

  let loadAgent = async () => {
    setIsLoading(true)
    try {
      let response = await findAgent(id)
      if (response.status != "SUCCESS") {
      } else {
        setAgent(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let suspendAct = async () => {
    setIsLoading(true)
    try {
      let response = await suspendAgent(id)
      if (response.status != "SUCCESS") {
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let unsuspendAct = async () => {
    setIsLoading(true)
    try {
      let response = await unsuspendAgent(id)
      if (response.status != "SUCCESS") {
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const getFundingW = () => {
    let fundingWallet = ""

    agent.wallets.forEach(wallet => {
      if (wallet.title == "Funded Wallet") {
        fundingWallet = wallet.id
      }
    });
    return fundingWallet
  }

  let loadAgentFunding = async () => {
    setIsLoading(true)
    try {
      let response = await agentFunding(getFundingW(), filter.from, filter.to)
      if (response.status != "SUCCESS") {
      } else {
        let fundings = []
        let transactions = response.data.transactions
        transactions.forEach(element => {
          if (element.description == "PAYMENT WITH CORALPAY") {
            fundings.push(element)
          }
        });
        setTransaction(fundings)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const getTotalFundings = () => {
    let total = 0.0
    transactions.forEach(element => {
      total += element.amount
    });
    return total
  }

  useEffect(() => {
    loadAgent().then(() => {
    })
    return () => { };
  }, []);

  useEffect(() => {
    loadAgentFunding()
    return () => { };
  }, [agent.wallets]);


  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <h2 className="text-2xl tracking-tight font-extrabold text-gray-900 my-5">
          Agent Profile
        </h2>

        <table>
          <tbody>
            <tr>
              <td className="border font-semibold p-1">Firstname</td>
              <td className="border p-1">{agent.profile.firstname}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Lastname</td>
              <td className="border p-1">{agent.profile.lastname}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Location</td>
              <td className="border p-1">   {agent.profile.address} --- {agent.profile.state} ---{" "}
                {agent.profile.lg}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Firstname</td>
              <td className="border p-1">{agent.profile.refcode}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Active Since</td>
              <td className="border p-1">{new Date(agent.profile.created_at * 1000).toString()}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Status</td>
              <td className="border p-1">Account is {agent.profile.suspended ?  "suspended":"open"}</td>
            </tr>
          </tbody>
        </table>

        <div className="py-5 align-middle inline-block min-w-full bg-gray-800 p-5 text-gray-100 mt-5">
          <div className="flex justify-between">

            <div className="flex justify-between">
              {agent.profile.suspended ? <button onClick={() => unsuspendAct()} className="rounded text-gray-800 px-8 py-2 text-sm bg-gray-100">
                Open Account
              </button> : <button onClick={() => suspendAct()} className="rounded text-gray-800 px-8 py-2 text-sm bg-gray-100">
                Suspend Account
              </button>}
            </div>

            <div className="align-middle self-center space-x-4">
              {
                agent.wallets.map(wallet =>
                  <Link to={{ pathname: "/wallets/" + wallet.id, state: { wallet: wallet } }} className="bg-gray-100 text-gray-800 p-2 rounded">View {wallet.title}</Link>
                )
              }
            </div>

          </div>
        </div>

        <div className="py-2 align-middle inline-block min-w-full">
          <div className="overflow-auto border-b border-gray-200 py-3">
            <div className="flex justify-between">
              <div>
                <h6>Funding records (Coral Pay)</h6>
                <p className="text-xs">From: {new Date(filter.from * 1000).toLocaleString()}</p>
                <p className="text-xs">To: {new Date(filter.to * 1000).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2">
                <p className="text-sm">From: </p>
                <input type="date" name="from" onChange={(e) => handleTimelineChange(e, 0, 0, 0)} class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7" />
                <p className="text-sm">To: </p>
                <input type="date" onChange={(e) => handleTimelineChange(e, 23, 59, 59)} name="to" class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7" />
                <button onClick={() => loadAgentFunding()} className="bg-gray-100 text-gray-800 p-1 text-sm rounded">Search</button>
              </div>
            </div>
            <div>
              <div className="py-2 align-middle inline-block min-w-full px-5">
                <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">

                  <div className="flex justify-between w-full px-5">
                    <h6 className="p-2 bg-gray-100 my-2">{transactions.length} Transactions Found</h6>
                    <div className="self-center">
                      <h6 className="self-center">
                        Total  ₦{getTotalFundings(transactions)}
                      </h6>
                    </div>
                  </div>

                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="font-bold bg-gray-800 text-gray-100">
                        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Date </th>
                        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Reference </th>
                        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Amount </th>
                        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Description </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map(transaction =>

                        <tr className="font-bold text-gray-800">
                          <td scope="col" className="px-6 py-3 text-left bg-gray-100    uppercase tracking-wider">
                            <h6>{new Date(transaction.created_at * 1000).toLocaleString()} </h6>
                          </td>
                          <td scope="col" className="px-6 py-3 text-left bg-white    uppercase tracking-wider">
                            <h6>{transaction.reference} </h6>
                          </td>
                          <td scope="col" className="px-6 py-3 text-left bg-gray-100    uppercase tracking-wider">
                            <h6>{transaction.amount} </h6>
                          </td>
                          <td scope="col" className="px-6 py-3 text-left bg-white    uppercase tracking-wider">
                            <h6>{transaction.description} </h6>
                          </td>
                        </tr>)
                      }
                    </tbody>
                  </table>


                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


