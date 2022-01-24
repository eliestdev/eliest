import Countdown from 'react-countdown';
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import Account from '../../assets/svg/Account.svg'
import { getMyTarget, getTarget, getGlobalTarget, verifyNuban, withdrawNuban, Withdraw } from './api'
import { useSelector } from 'react-redux'

export default function Targets({ open, setOpen, target }) {
    const cancelButtonRef = useRef(null)
    const wallets = useSelector((state) => state.auth.wallets);

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({});
    const [results, setResults] = useState({ length: 0, active: [], inactive: [] });
    const [timeLeft, setTimeLeft] = useState(0)
    const [globalT, setGlobalT] = useState({})
    const [withdraw, setWithdraw] = useState({
        enabled: false,
        nuban: null,
        recipient: null,
        amount: null,
        bank: null,
        name: null,
        verified: false
    })
    const [response, setResponse] = useState("");

    const verifyAccountNumber = async () => {
        setIsLoading(true)
        if (withdraw.verified && withdraw.recipient !== null && withdraw.name !== null) {
            setWithdraw({ ...withdraw, amount: results.active.length + results.inactive.length * globalT.reward })
            try {
                let a  = (results.active.length + results.inactive.length) * globalT.reward
                let wid = wallets[0].id
                let response = await Withdraw(a.toString(), wid, withdraw.recipient , target.ID.toString())
               if (response.status !== "SUCCESS") {
                    setResponse(response.message)

                } else {
                    setResponse("Success!!! Your transfer is been processed.")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        } else {
            try {
                let response = await verifyNuban({ "nuban": withdraw.nuban, "bank": withdraw.bank })
                if (response.status !== "SUCCESS") {
                    setResponse(response.message)

                } else {
                    setWithdraw({ ...withdraw, recipient: response.data.recipient, name: response.data.name, verified: true })
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }

        }
    };

    const getTargetResult = async () => {
        setIsLoading(true)
        try {
            let gT = await getGlobalTarget();
            setGlobalT(gT.data[0])
            let response = await getTarget(target.ID)
            setStatus(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setTimeLeft(new Date((target.timeline * 1000)))

        if (status.active) {
            setResults({ ...results, active: status.active })
        }
        if (status.inactive) {
            setResults({ ...results, inactive: status.inactive })
        }
        return () => { };
    }, [status]);

    useEffect(() => {
        setResults({ length: 0, active: [], inactive: [] })
        getTargetResult()
        return () => { };
    }, [open]);


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                            {withdraw.enabled ? "Transfer reward to bank" : <span>Refer and activate <p>{target.downline} new agents</p></span>}
                                        </Dialog.Title>

                                        {!withdraw.enabled && <div>
                                            <div className="mt-6 text-left">
                                                <h4>Progress so far</h4>
                                            </div>

                                            <div className="w-full flex justify-between space-x-3 p-2">
                                                <p className="flex-1 self-center text-left border p-3">New Referrals</p>
                                                <input className="w-32 px-5 bg-transparent border" type="number" disabled value={results.active.length + results.inactive.length} />
                                                <span>
                                                    <Countdown date={timeLeft} className="px-5 py-3 bg-transparent" />
                                                </span>
                                            </div>
                                            <div className="w-full flex justify-between space-x-3 p-2">
                                                <p className="flex-1 self-center text-left border p-3">Current Reward</p>
                                                <input className="w-32 px-5 bg-transparent border" type="number" disabled value={(results.active.length + results.inactive.length) * globalT.reward} />
                                            </div>
                                            {results.active.map(agent => <div className="w-full flex justify-between space-x-3 p-2">
                                                <p className="flex-1 self-center text-left border p-3">{agent.firstname}</p>
                                                <p className="flex-1 self-center text-left border p-3">Joined {new Date(agent.created_at * 1000).toLocaleDateString()} </p>
                                                <input className="w-32 px-5 bg-green-400 bg-transparent border" disabled value="Activated" />
                                            </div>)}
                                            {results.inactive.map(agent => <div className="w-full flex justify-between space-x-3 p-2">
                                                <p className=" self-center text-left border p-3">{agent.firstname}</p>
                                                <p className="flex-1 self-center text-left border p-3">Joined {new Date(agent.created_at * 1000).toLocaleDateString()}</p>

                                                <input className="w-32 bg-red-400 px-5 bg-transparent border" disabled value="Not Activated" />
                                            </div>)}
                                        </div>}

                                        {withdraw.enabled && <div>
                                            <div className="py-2">

                                                <select className="h-18  appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-green-200 focus:border-green-200"
                                                    required
                                                    name="Select Bank"
                                                    onChange={(e) => setWithdraw({ ...withdraw, bank: e.target.value })}
                                                >
                                                    <option defaultValue="">Select Bank</option>
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
                                            </div>

                                            <div>
                                                <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="code"
                                                        placeholder="Account number"
                                                        onChange={(e) => setWithdraw({ ...withdraw, nuban: e.target.value })}

                                                    />
                                                </div>

                                                {withdraw.verified && <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="code"
                                                        placeholder="Account name"
                                                        value={withdraw.name}
                                                    />
                                                </div>}

                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div>{response}</div>
                            <div className="px-4 py-3 sm:px-6 mb-4">
                                {!withdraw.enabled && <button style={{ width: '94%' }} type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)} >
                                    Close
                                </button>}

                                <button style={{ width: '94%' }} type="button"
                                    className="mt-5 h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => withdraw.enabled ? verifyAccountNumber() : setWithdraw({ ...withdraw, enabled: true })} >
                                    {withdraw.enabled ? "Proceed" : "Withdraw to bank account"}
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )

}