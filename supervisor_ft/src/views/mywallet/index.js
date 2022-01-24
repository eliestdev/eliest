import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Loading } from 'views/myagents';
import { selectToken } from 'features/authentication/authSlice';
import { Link } from 'react-router-dom';
import { getMyWallet } from './api';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import x from '../../assets/svg/X.svg'
import Logo from '../../assets/img/small.png'
import './index.css'

const Index = ({ open, setOpen, profile }) => {
    const [code, setCode] = useState(null);
    const [amount, setAmount] = useState(0);
    const cancelButtonRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false);
    const [wallet, setWallet] = useState({ balance: 0.0, transactions: [], info: {} });

    const [topUp, setTopUp] = useState(false);

    let getWallet = async () => {
        setIsLoading(true)
        try {
            let response = await getMyWallet()
            if (response.status != "SUCCESS") {
            } else {
                setWallet(response.data.walletquery)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const copy = async () => {
        const ussdCode = `*${code}*000*950*+${profile.refcode}+${amount}#`;
        await navigator.clipboard.writeText(ussdCode)
        alert('Code copied')
    }

    useEffect(() => {
        console.log(profile)
        getWallet();
        return () => { };
    }, []);

    return (
        // <div className="flex items-center justify-between w-full">
        //     <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        //         <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
        //             <p className="text-xl font-medium leading-5 text-gray-800">
        //                 Wallet
        //             </p>
        //             <span className="self-end items-end place-self-end mb-5 block">Current Balance: {wallet.balance}</span>

        //             {wallet.transactions.map((transaction) => (
        //                 <div className="flex items-center justify-between text-xs flex-wrap  border-b my-2 p-1">
        //                     <div className="w-0 flex-1 flex items-center">
        //                         <p className="ml-3   truncate">
        //                             <p className="">
        //                                 {transaction.description}
        //                             </p>
        //                         </p>
        //                     </div>
        //                     <div className="w-0 flex-1 flex items-center justify-center">
        //                         <p className="ml-3 font-medium  truncate">
        //                             <span className="font-thin">
        //                                 ₦{(transaction.amount).toLocaleString("en-US")}
        //                             </span>
        //                         </p>
        //                     </div>
        //                     <div className="w-0 flex-1 flex items-center justify-end">
        //                         <p className="ml-3 font-medium text-xs  truncate">
        //                             <span className="">
        //                             {new Date(transaction.created_at * 1000).toLocaleDateString()}
        //                             </span>
        //                         </p>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        //     <Loading show={isLoading} />
        // </div>

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
                                            {topUp ? "Fund Wallet" : " Wallet"}
                                        </Dialog.Title>
                                        <div className="mt-6 w-full mb-6">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                {!topUp && <div className="px-6 mb-4">
                                                    <div className="px-4 py-4 rounded-xl bg-green-500 h-auto">
                                                        <div className="flex px-4">
                                                            <img src={Logo} />
                                                        </div>

                                                        <div className="text-center text-white mt-6">
                                                            <div className="wa my-2">Wallet balance</div>
                                                            <div className="flex justify-center">
                                                                <div>N</div>
                                                                <div className="amount">{wallet.balance}.</div> <div>00</div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <button className="nt text-green-500 rounded bg-white py-3 px-5" onClick={() => setTopUp(true)}>Top-up</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>}

                                                {/* Bank Selection */}
                                                <div>
                                                    {topUp && <div>
                                                        <select className="wema border-0 p-2 placeholder-gray-500 text-gray-800 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full" onChange={(e) => setCode(e.target.value)}>
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

                                                        <div className="py-5">
                                                            <input placeholder="Amount" className="w-full px-3" onChange={(e) => setAmount(e.target.value)} />
                                                        </div>

                                                        {code !== null && amount !== 0 && <div className="pt-5">
                                                            <div className="gret">USSD code</div>
                                                            <div className="flex justify-between">
                                                                <span className="code items-steart">*{code}*000*950*+{profile.refcode}+{amount}#</span>
                                                                <button className="a bg-green-500 rounded px-6 py-2 text-white" onClick={copy}>Copy</button>
                                                            </div>
                                                        </div>
                                                        }

                                                    </div>}
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};


Index.propTypes = {

};


export default Index;
