import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import { useSelector } from 'react-redux';
import { sendVtu } from './api';

export default function TransferAgent({ open, setOpen }) {
    const wallets = useSelector((state) => state.auth.wallets);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const cancelButtonRef = useRef(null)
    const [vtu, setVtu] = useState({
        "class": "02",
        "amount": 0.0,
        "phone": "",
        "wallet": ""
    });

    useEffect(() => {
        if (wallets.length > 0) {
            setVtu({ ...vtu, wallet: wallets[0].id })
        }
        return () => { };
    }, [wallets]);

    let CallVtu = async (_vtu) => {
        const copyVtu = { ..._vtu }
        if (isNaN(copyVtu.amount)) {
            alert("Enter a valid number")
            return
        }
        setIsLoading(true)
        try {
            let response = await sendVtu(copyVtu)
                setResponse(response.message)            
        } catch (error) {
            //alert(response.message)
            setResponse("Count not complete")            

            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full pb-5">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                            Transfer to agent
                                        </Dialog.Title>
                                        <div className="mt-6 w-full">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                <div className="py-1">
                                                    <select className="h-18 bg-green-200 appearance-none border-2 border-green-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-green-200 focus:border-green-200"
                                                        required
                                                        name="bank"
                                                        placeholder="Winning wallet" onChange={(e) => { setVtu({ ...vtu, wallet: e.target.value }) }}>
                                                        {wallets.map(wallet => <option value={wallet.id}>{wallet.title}</option>)}
                                                    </select>
                                                </div>

                                                <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                        required
                                                        name="phone"
                                                        onChange={(e) => { setVtu({ ...vtu, phone: e.target.value }) }}

                                                        placeholder="Phone number"
                                                    />
                                                </div>

                                                <div className="py-2">
                                                    <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="number"
                                                        required
                                                        name="amount"
                                                        onChange={(e) => { setVtu({ ...vtu, amount: Number(e.target.value) }) }}
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isLoading && <i class="fas fa-spinner fa-pulse"></i>}

                            <div className="px-4 py-3 sm:px-6 mb-4">
                                <button
                                    style={{ width: '94%' }}
                                    type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => { setVtu({ ...vtu, class: "02" }); CallVtu(vtu) }}
                                >
                                    Proceed
                                </button>
                            </div>

                            {response && <h4>{response}</h4>}

                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
