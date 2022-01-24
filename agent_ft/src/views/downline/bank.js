import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import x from '../../assets/svg/X.svg'
import { verifyNuban, withdrawNuban } from '../../components/dialog/api'
import { useSelector } from 'react-redux'

const BankWithdrawal = ({ data, open, setOpen }) => {
    const [isVerifying, setIsVerifying] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [response, setResponse] = useState("");
    const wallets = useSelector((state) => state.auth.wallets);

    const cancelButtonRef = useRef(null)

    const [withdrawal, setWithdrawal] = useState({
        "recipient": "",
        "amount": data.commission,
        "bank": "",
        "nuban": "",
        "name": "",
        "verified": false
    });

    let makeWithdrawal = async () => {
        setIsWithdrawing(true)
        try {
            let response = await withdrawNuban({ "amount": withdrawal.amount.toString(), "recipient": withdrawal.recipient, wallet: wallets[0].id })
            if (response.status !== "SUCCESS") {
                setResponse(response.message)

            } else {
                setResponse("Success!!! Your transfer is been processed.")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsWithdrawing(false)
        }
    };


    let findVerifyWithdrawal = async () => {
        setResponse("")
        setIsVerifying(true)
        try {
            let response = await verifyNuban({ "nuban": withdrawal.nuban, "bank": withdrawal.bank })
            if (response.status !== "SUCCESS") {
                setResponse(response.message)

            } else {
                setWithdrawal({ ...withdrawal, recipient: response.data.recipient, name: response.data.name, verified: true })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsVerifying(false)
        }
    };

    return (
        <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
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
                    <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-start">
                                <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                    <img className="close" src={x} onClick={() => setOpen(false)} />
                                    <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                        Bank withdrawal
                                    </Dialog.Title>
                                    <div className="mt-6 w-full">
                                        <p className="text-sm text-gray-500 dialog--subtitle">
                                            
                                            <div className="py-2">

                                                <select className="h-18  appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-green-200 focus:border-green-200"
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

                                            <div>
                                                <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="code"
                                                        placeholder="Account number"
                                                        onChange={(e) => setWithdrawal({ ...withdrawal, nuban: e.target.value })}

                                                    />
                                                </div>

                                                {withdrawal.verified && <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="code"
                                                        placeholder="Account name"
                                                        value={withdrawal.name}
                                                    />
                                                </div>}

                                            </div>

                                            <div className="py-2">
                                                <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                    required
                                                    name="code"
                                                    readOnly
                                                    placeholder="Amount"
                                                    value={data.commission}
                                                    
                                                />
                                            </div>

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isVerifying && <i class="fas fa-spinner fa-pulse"></i>}
                        {isWithdrawing && <i class="fas fa-spinner fa-pulse"></i>}

                        <div className="px-4 py-3 sm:px-6 mb-4">
                            <button
                                style={{ width: '94%' }}
                                type="button"
                                className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => { withdrawal.verified ? makeWithdrawal() : findVerifyWithdrawal() }}                                >
                                {!withdrawal.verified ? 'Verify account number' : 'Withdraw'}
                            </button>
                        </div>
                        <div className="px-4 py-3 sm:px-6 mb-4">
                            {response != "" && <p className="text-xs text-red-800 text-center mt-2">{response}</p>}

                        </div>

                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>
    )
} 

export default BankWithdrawal