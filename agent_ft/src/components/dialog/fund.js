import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import { useSelector } from 'react-redux';

export default function FundModal({ open, setOpen }) {
    const profile = useSelector((state) => state.auth.profile);

    const cancelButtonRef = useRef(null)
    const [ussd, setUssd] = useState("");
    const [bank, setBank] = useState("");
    const [amount, setAmount] = useState(1000);

    useEffect(() => {
        setUssd("*" + bank + "*000*950+" + profile.refcode + "+" + amount + "#");
    }, [amount]);

    // useEffect(() => {
    //     setUssd("*" + bank + "*000*950+" + profile.refcode + "+" + amount + "#");
    // }, [amount]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                        <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                            Fund Wallet
                                        </Dialog.Title>
                                        <div className="mt-6 w-full">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                <div className="py-1">
                                                    <select className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500"
                                                        required name="bank" placeholder="Select bank" onChange={(e) => {
                                                            setBank(e.target.value)
                                                            setUssd("*" + e.target.value + "*000*950+" + profile.refcode + "+" + amount + "#");
                                                        }} >
                                                        <option disabled selected>
                                                            --Select Bank--
                                                        </option>
                                                        <option value="901">Access Bank</option>
                                                        <option value="901">Ecobank</option>
                                                        <option value="770">Fidelity Bank</option>
                                                        <option value="894">First Bank</option>
                                                        <option value="389*214">
                                                            First City Monument Bank (FCMB)
                                                        </option>
                                                        <option value="737">Guaranty Trust Bank (GTB)</option>
                                                        <option value="322*00">Heritage Bank</option>
                                                        <option value="7111">Keystone Bank</option>
                                                        {/* <option value="providus">Providus Bank</option> */}
                                                        <option value="833">Stanbic IBTC Bank</option>
                                                        {/* <option value="standard">
                                                            Standard Chartered Bank
                                                        </option> */}
                                                        <option value="822">Sterling Bank</option>
                                                        <option value="826">Union Bank</option>
                                                        <option value="919">
                                                            United Bank for Africa (UBA)
                                                        </option>
                                                        <option value="7799">Unity Bank</option>
                                                        <option value="945">Wema Bank</option>
                                                        <option value="966">Zenith Bank</option>
                                                    </select>
                                                </div>

                                                <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="number"
                                                        required
                                                        name="amount"
                                                        placeholder="Amount"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                </div>

                                               {bank.length > 1 &&  <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="code"
                                                        value={ussd}
                                                        disabled={true}
                                                        placeholder="*332*48292#"
                                                    />
                                                </div>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 mb-4">
                                <button
                                    style={{ width: '94%' }}
                                    type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Copy USSD code
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
