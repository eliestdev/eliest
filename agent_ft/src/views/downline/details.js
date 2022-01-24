import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDownlineTransactions, moveToFundedWallet } from './api'
import BankWithdrawal from './bank'

const DownlineDetails = () => {
    const { id } = useParams()
    const [data, setdata] = useState({
        agent: null,
        transactions: null,
        downlines: null,
        second: null,
        loaded: false,
        commission: null,
        show: false
    })

    const [modal, setModal] = useState(false)

    const getAgentTransactions = async () => {
        const res = await getDownlineTransactions(id)
        setdata({ ...data, loaded: true, agent: res.data.agent, downlines: res.data.downlines, second: res.data.second, transactions: res.data.transactions, commission: res.data.commission })
    }

    const move = async () => {
        const res = await moveToFundedWallet(data.agent.id, data.commission)

        if (res.status === "SUCCESS") {
            alert("Your Commission has been moved to your funding wallet")
        } else {
            alert(res.message)
        }
    }

    useEffect(() => getAgentTransactions(), [])

    return (
        <>
            <BankWithdrawal data={data} open={modal} setOpen={setModal} />
            <div className="md:px-8">
                {data.loaded && <div>
                    <div className="py-5 text-xl">{data.agent.firstname} {data.agent.lastname}'s Downline</div>

                    <div className="md:grid md:grid-cols-2">
                        <div>
                            <div className="py-3">Downline Information</div>
                            <div>
                                Number of Downlines: {data.downlines.length} {data.downlines.length && data.downlines.length > 0 && <span className="text-green-500 cursor-pointer" onClick={() => setdata({ ...data, show: !data.show })}>{data.show ? "Hide" : "View"}</span>}
                            </div>

                            {data.show && <div className="py-4">
                               {data.downlines.map((d) => (
                                   <div className="mb-3 border border-0 border-green-300 px-3 rounded-2xl w-1/2 py-1 text-green-500">{d.firstname} {d.lastname}</div>
                               ))}
                            </div>
                            }

                            <div className="mt-2">
                                Number of Second-level Downlines: {data.second !== null || data.second !== [] ? data.second.length : "N/A"}
                            </div>

                            <div className="py-4">
                                Accrued Reward: N{data.commission}
                            </div>

                            <div className="flex  mt-4 gap-4">
                                <button className="text-green-500 cursor-pointer" onClick={move}>Move to Funding Wallet</button>
                                <button className="text-white cursor-pointer bg-green-500 rounded py-2 px-4" onClick={() => setModal(true)}>Withdraw to bank account</button>
                            </div>
                        </div>
                        <div className="border border-0 border-gray-200 rounded-xl py-3">
                            <div className="text-center mb-4 text-md">Winning Transactions</div>

                            {data.transactions && data.transactions.map((t) => (
                                <div className="flex px-6 py-1 justify-between">
                                    <div>{t.description}</div>
                                    <div>N{t.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                }
            </div>
        </>
    )
}

export default DownlineDetails