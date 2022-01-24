import { Fragment, useRef, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from "features/authentication/authSlice";

const env = process.env;

const TransferWinnings = ({ open, setOpen, profile }) => {
    const cancelButtonRef = useRef(null)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)

    const token = useSelector((state) => state.auth.token)

    const [option, setOption] = useState(0);

    const [req, setReq] = useState({
        amount: null,
        agent: null,
        recipient: null,
    })

    const [message, setMessage] = useState(null)

    const [withdrawal, setWithdrawal] = useState({
        recipient: "aa",
        amount: 0.0,
        bank: "",
        nuban: "",
        name: "",
        verified: false
    });

    const changeInputs = (e) => setReq({ ...req, [e.target.name]: e.target.value })

    const transfer = async () => {
        const uri = `${env.REACT_APP_PLAY_URL}transfer`
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                msisdn: profile.msisdn,
                agent: req.agent,
                amount: Number(req.amount)
            })
        }

        try {
            setIsLoading(true)
            const res = await fetch(uri, params)
            const data = await res.json();
            setMessage(data)
        } catch (e) {
            setMessage(e)
        } finally {
            setIsLoading(false)
        }
    }

    const transferToBank = async () => {
        const uri = `${env.REACT_APP_PLAY_URL}transfer-bank`
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                wallet: profile.msisdn,
                recipient: withdrawal.recipient,
                amount: withdrawal.amount
            })
        }

        try {
            setIsLoading(true)
            const res = await fetch(uri, params)
            const data = await res.json();
            setMessage(data)

        } catch (e) {
            setMessage(e)
        } finally {
            setIsLoading(false)
        }
    }

    const verifyAccount = async () => {
        const uri = `${env.REACT_APP_PLAY_URL}verify-bank`
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                bank: withdrawal.bank,
                nuban: withdrawal.nuban,
            })
        }

        try {
            setIsLoading(true)
            const res = await fetch(uri, params)
            const result = await res.json();
            const {data}  = result
            setWithdrawal({ ...withdrawal, recipient: data.recipient, name: data.name, verified: true })
        } catch (e) {
            setMessage(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => dispatch(setOpen(false))}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Transfer Winnings
                                        </Dialog.Title>
                                        <div className="py-4 flex gap-3">
                                            <span onClick={(e) => setOption(0)} className="cursor-pointer text-center bg-green-500 text-white rounded-2xl py-1 px-3 hover:text-green-500 hover:bg-transparent items-center content-center">Agent</span>
                                            <span onClick={(e) => setOption(1)} className="cursor-pointer text-center bg-green-500 text-white rounded-2xl py-1 px-3 hover:text-green-500 hover:bg-transparent items-center content-center">Bank Account</span>
                                        </div>
                                        <div className="mt-2 w-full">
                                            {option === 0 && <p className="text-sm text-gray-500">
                                                {message && <span>{message.data}</span>}
                                                <div className="mt-4">
                                                    <input style={{ minWidth: '33vw' }} name="agent" placeholder="Agent Phone number" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" value={req.agent} onChange={changeInputs} />
                                                </div>

                                                <div className="mt-4">
                                                    <input style={{ minWidth: '33vw' }} name="amount" placeholder="Amount" min="10" type="number" value={req.amount} onChange={changeInputs} className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" />
                                                </div>

                                                <div className="py-3">
                                                    {message && message.error != null && <span className="text-red-500">{message.error}</span>}
                                                </div>
                                            </p>}

                                            {option === 1 && <p className="text-sm text-gray-500">
                                            {message && <span>{message.message}</span>}
                                            {message && <span>{message.data}</span>}
                                                <div className="mt-4">
                                                    <select className="appearance-none border-2 rounded w-full px-4 text-gray-700 leading-tight focus:outline-none"
                                                        required
                                                        name="Select Bank"
                                                        onChange={(e) => setWithdrawal({ ...withdrawal, bank: e.target.value })}
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
                                                <div className="mt-4">
                                                    <input style={{ minWidth: '33vw' }} name="recepient" placeholder="Account Number" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" value={withdrawal.nuban} onChange={(e) => setWithdrawal({ ...withdrawal, nuban: e.target.value })} />
                                                </div>

                                                {
                                                    withdrawal.verified && <div className="mt-4">
                                                        <input style={{ minWidth: '33vw' }} placeholder="Account Holder Name" value={withdrawal.name} readOnly className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" />
                                                    </div>
                                                }

                                                <div className="mt-4">
                                                    <input style={{ minWidth: '33vw' }} name="amount" placeholder="Amount" min="10" type="number" value={withdrawal.amount} onChange={(e) => setWithdrawal({ ...withdrawal, amount: e.target.value })} className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" />
                                                </div>

                                                <div className="py-3">
                                                    {message && <span className="text-red-500">{message.message}</span>}
                                                </div>
                                            </p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div classNmae="text-center mx-auto flex justify-center content-center items-center">{isLoading && <i class="fas fa-spinner fa-pulse"></i>}
                            </div>

                            {option === 0 && <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    disabled={isLoading}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={transfer}
                                >
                                    {isLoading ? "loading..." : "Transfer"}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => dispatch(setOpen(false))}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>}

                            {option === 1 && <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    disabled={isLoading}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={!withdrawal.verified ? verifyAccount : transferToBank}
                                >
                                    {!withdrawal.verified ? 'Verify account number' : 'Withdraw'}
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => dispatch(setOpen(false))}
                                    ref={cancelButtonRef}
                                >
                                    Cancel
                                </button>
                            </div>}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default TransferWinnings