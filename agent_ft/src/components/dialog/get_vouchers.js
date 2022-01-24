import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import { useSelector } from 'react-redux'
import { findWallet } from 'components/dashboard/api'
import { generateVouchers } from './api'

export default function Profile({ open, setOpen }) {

    const vouchers = [
        { amount: 50, count: 0 },
        { amount: 100, count: 0 },
        { amount: 200, count: 0 },
        { amount: 400, count: 0 },
        { amount: 1000, count: 0 },
    ]

    const cancelButtonRef = useRef(null)
    const [selectedWallet, setSelectedWallet] = useState("");
    const [total, setTotal] = useState(0);
    const discounted = () => total - Math.round((total / 100) * 20)
    const [discount, setDiscount] = useState(discounted());
    const [payload, setPayload] = useState(vouchers);
    const wallets = useSelector((state) => state.auth.wallets);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let total = 0
        payload.forEach(v => total += v.amount * v.count);
        setTotal(total)
    }, [payload]);

    useEffect(() => {
        setDiscount(discounted())
    }, [total]);

    const updatePayload = (voucher, index) => {
        let copyVoucher = [...payload]
        copyVoucher[index] = voucher
        setPayload(copyVoucher)
    }

    let randomLengths = [10, 11, 12, 13];

    let getVouchers = async () => {
        let show = randomLengths[Math.floor(Math.random() * randomLengths.length)];
        setIsLoading(true)
        let vouchers = {}
        payload.forEach(e => {
            vouchers[e.amount] = Number(e.count)
        });
        let updatedValue = { ...vouchers, length: show, wallet: selectedWallet };

        try {
            let response = await generateVouchers(updatedValue)
            if (response.status == "SUCCESS") {
                setResponse("Voucher generated successfully")
            }
            else {
                setError(response.message)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)

        }
    };

    let isValid = selectedWallet == "" || total == 0

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300 overflow-y-auto" enterFrom="opacity-0 overflow-y-auto"
                        enterTo="opacity-100 overflow-y-auto" leave="ease-in duration-200 overflow-y-auto" leaveFrom="opacity-100 overflow-y-auto" leaveTo="opacity-0 overflow-y-auto"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 overflow-y-auto">
                                <div className="flex items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                            Get Vouchers
                                        </Dialog.Title>

                                        <div className="dialog--content modal-content">
                                            {payload.map((voucher, index) => <div className="mt-6 w-full flex justify-between space-x-3 py-2">
                                                <p className="flex-1 self-center text-left border p-3">{voucher.amount}</p>
                                                <input className="w-32 px-5 bg-transparent border" type="number" min={0} value={voucher.count} onChange={(e) => updatePayload({ ...voucher, count: e.target.value }, index)} />
                                            </div>)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-left pt-5 text-lg leading-6 font-medium dialog--title">
                                    <p>Amount Due</p>
                                </div>
                                <div className="my-2 w-full ">
                                    <hr />
                                </div>
                                <div className="w-full flex justify-between space-x-3 p-2">
                                    <p className="flex-1 self-center text-left border p-3">Total</p>
                                    <input className="w-32 px-5 bg-transparent border" type="number" disabled value={total} />
                                </div>
                                <div className="w-full flex justify-between space-x-3 p-2">
                                    <p className="flex-1 self-center text-left border p-3">Discounted Price</p>
                                    <input className="w-32 px-5 bg-transparent border" type="number" disabled value={discount} />
                                </div>



                                <div className="text-left pt-5 text-lg leading-6 font-medium dialog--title">
                                    <p>Select Wallet</p>
                                </div>
                                <div className="my-2 w-full ">
                                    <hr />
                                </div>
                                {wallets.map(wallet => <WalletBalance wallet={wallet} selectedId={selectedWallet} setSelectedWallet={setSelectedWallet} />)}

                            </div>
                            {response && <p>{response}</p>}
                            {error && <p>{error}</p>}
                            {isLoading && <i class="fas p-3 text-2xl fa-spinner fa-pulse"></i>}

                            <div className="px-4 py-3 sm:px-6 mb-4">
                                <button
                                    style={{ width: '94%' }}
                                    type="button"
                                    className={"h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4  text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm " + (isValid ? " cursor-not-allowed bg-gray-200" : " bg-green-600")}
                                    onClick={() => getVouchers()}
                                    disabled={isValid}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

function WalletBalance({ wallet, selectedId, setSelectedWallet }) {
    const [tinyLoading, setTinyLoading] = useState(false);
    const [detail, setDetail] = useState(null);

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

    return (
        <div className={"w-full flex justify-between p-5 mt-2 border " + (selectedId === wallet.id && " bg-green-50")} onClick={() => setSelectedWallet(wallet.id)}>
            <p className="">{wallet.title}</p>

            {wallet.id && <h3 className="self-center text-center">
                ₦ {detail && detail.balance}   {tinyLoading && <i class="fas fa-spinner fa-pulse"></i>} </h3>}
        </div>
    )
}
