import Back from '../../assets/svg/CaretLeft.svg'
import './index.css'
import Grey from '../../assets/svg/UserGrey.svg'
import Right from '../../assets/svg/ArrowRight.svg'
import { useParams, useHistory } from 'react-router'
import VerifiedDownlines from 'ui/verified downline'
import { useEffect, useState } from 'react'
import { getAgent, getWallets, getTransaction, getTransactions, getWeeklyTransactions } from "../../views/myagents/api";
import { getAgentInfo, getAgentDownline } from './api'
import Chart from "../../components/chart/chart";

const Details = () => {
    const history = useHistory();
    const { id } = useParams();
    const [agent, setAgent] = useState({})
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ balance: 0, profile: {}, transactions: { transactions: [] } });
    const [filter, setFilter] = useState({ content: "", type: "", ref: "", start: 962641361, end: Date.now(), });
    const [transactions, setTransactions] = useState([]);

    const [downlines, setDownlines] = useState([])

    let getProfile = async () => {
        setIsLoading(true)
        try {
            let response = await getAgent(id)
            if (response.status != "SUCCESS") {
            } else {
                setData(response.data)
                const a = await getWallets(response.data.profile.id)
                const funded = a.data.wallets.find(a => a.title === "Funded Wallet");
                await getWeekly(funded.id)
                const t = await getTransaction(funded.id)
                setTransactions(t.data.transaction)
                // const max = new Date().getTime();
                // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                // var dayOfWeek = days[new Date(max).getDay()]
                // const datePar = findWeeklyFundings(max);
                // const all = await getTransactions(t.data.transaction.account, t.data.transaction.reference, t.data.transaction.class, t.data.transaction.description, t.data.transaction.supervisor, datePar.from, datePar.to);
                // setTransactions(all.data.transactions);
                // const sort = all.data.transactions.sort(compare)
                // console.log(sort)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const Downlines = async (agent) => {
        const res = await getAgentDownline(agent.refcode);
        setDownlines(res.data.direct)
    }

    const getWeekly = async (walletId) => {
        var curr = new Date
        var first = curr.getDate() - curr.getDay()
        var last = first + 6

        var firstDate = new Date(curr.setDate(first))
        var lastDate = new Date(curr.setDate(last))

        const res = await getWeeklyTransactions(walletId, firstDate.getTime(), lastDate.getTime())
        console.log(res)
    }

    useEffect(async () => {
        const res = await getAgentInfo(id)
        setAgent(res.data.profile)
        setIsLoading(false)
        await getProfile()
        await Downlines(res.data.profile)
    }, [])

    return (
        <>
            <VerifiedDownlines open={open} setOpen={setOpen} downlines={downlines} />
            {!isLoading && <div className="px-8 py-6">
                <div className="w-full px-8 border border-0 rounded-xl h-auto">
                    <div className="flex py-8 cursor-pointer divide-y-0" onClick={(e) => history.goBack()}>
                        <img src={Back} />
                        <span className="back">Back</span>
                    </div>

                    <div className="flex gap-6">
                        <div className="rounded border border-0 px-6 bg-white py-4">
                            <div className="flex justify-between gap-2" onClick={() => setOpen(true)}>
                                <span className="ver">Verified downlines</span>
                                {/* <span className="per">+20%</span> */}
                            </div>

                            <div className="flex py-4 items-center content-center">
                                <img src={Grey} />
                                <div className="num ml-2">{downlines.length}</div>
                            </div>

                            <div className="flex pt-3 justify-between">
                                <div>{agent.firstname}</div>
                                <img src={Right} />
                            </div>
                        </div>

                        <div className="rounded border border-0 px-6 py-4 bg-white">
                            <div className="flex justify-between gap-2">
                                <span className="ver">Unverified downlines</span>
                                {/* <span className="per">+20%</span> */}
                            </div>

                            <div className="flex py-4 items-center content-center">
                                <img src={Grey} />
                                <div className="num ml-2">0</div>
                            </div>

                            <div className="flex pt-3 justify-between">
                                <div>{agent.firstname}</div>
                                <img src={Right} />
                            </div>
                        </div>

                        <div className="rounded border border-0 px-6 py-4 bg-white">
                            <div className="flex justify-between">
                                <span className="ver">Available amount in wallet</span>
                                <span className="per"></span>
                            </div>

                            <div className="flex py-4">
                                <div className="num">₦{data.balance}</div>
                            </div>

                            <div className="flex pt-3">
                                <div className="card-footer">Last seen: 10 minutes ago</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 py-6">
                        <div className="flex-1">
                            <div className="hea mb-3">Analytics of user</div>

                            <div className="border border-0 bg-white px-6 rounded py-4">
                                <Chart transactions={transactions} />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="hea mb-3">Transactions</div>

                            <div className="border border-0 bg-white px-4 rounded h-auto py-4">
                                {transactions.length === 0 && <div className="font-semibold text-center">
                                    No Transactions have been made
                                </div>
                                }
                                <div>
                                    {transactions.map((a => (
                                        <div className="flex justify-between py-2">
                                            <div className="am">N{a.amount}.00</div>
                                            <div>{a.description}</div>
                                        </div>
                                    )))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}

export default Details;