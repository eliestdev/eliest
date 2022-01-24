/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BellIcon, CreditCardIcon, ExclamationIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'
import { toggleGameModal } from 'features/games/gameSlice'
import { PlayUSSD } from 'api/fetch'
import { setLoading } from 'features/games/gameSlice'
import { setResponse } from 'features/games/gameSlice'
import { GetProfile } from 'api/fetch'
import { setProfile } from 'features/authentication/authSlice'
import { toggleFundModal } from 'features/authentication/authSlice'
import { LoadVoucher } from 'api/fetch'
import { setFundResponse } from 'features/authentication/authSlice'
import { setFundLoading } from 'features/authentication/authSlice'

export default function FundAlert({ open }) {
    const dispatch = useDispatch()

    const token = useSelector((state) => state.auth.token)
    const profile = useSelector((state) => state.auth.profile)
    const response = useSelector((state) => state.auth.fundResponse)
    const isLoading = useSelector((state) => state.auth.loading)
    const [voucher, setVoucher] = useState("");
    const [amt, setAmt] = useState(1000);
    const [bank, setBank] = useState("");
    const [ussd, setUssd] = useState("");
    const cancelButtonRef = useRef(null)

    const setOpen = () => {
        dispatch(toggleFundModal())
    }

    const getProfile = async () => {
        try {
            const res = await GetProfile(token)
            const data = await res.json()
            const profile = data.data
            dispatch(setProfile(profile))
        } catch (error) {

        }
    }

    const handleLoadVoucher = async () => {
        try {
            const res = await LoadVoucher(profile.msisdn, voucher)
            const data = await res.json()
            if (data.error) {
                dispatch(setFundResponse(data.error))
            }else{
                dispatch(setFundResponse("Recharge Successful")) 
            }
           
        } catch (error) {

        } finally {
            dispatch(setFundLoading(false))
        }

    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(ussd)
    }

    useEffect(() => {
        setUssd(`*${bank}*000*950+${profile.refcode}+${amt}#`)
        return () => { };
    }, [amt, bank]);


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">  &#8203; </span>
                    <Transition.Child
                        as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                 
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 text-left">
                                            Fund Account
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <input required id="voucher" name="voucher" value={voucher} onChange={(e) => setVoucher(e.target.value)} type="text" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter voucher here" />
                                        </div>
                                        <button type="button" className="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500  my-1" onClick={() => handleLoadVoucher()}>
                                            Load Vouchers
                                        </button>
                                        {isLoading && <i class="fas fa-circle-notch fa-spin text-green-600 text-3xl text-center self-center"></i>}

                                        <div className="mt-2 space-y-2 self-center flex justify-center">
                                            {!isLoading && response}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 p-2">

                                    <div className="mt-3 flex text-center sm:mt-0 sm:ml-4 sm:text-left w-full self-center">
                                        <Dialog.Title as="h3" className="text-lg  font-medium text-gray-900 ">
                                            Fund with Bank
                                        </Dialog.Title>
                                    </div>

                                    <div className="mt-1">
                                        <input required id="amount" name="amount" type="text" className="h-12 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-1 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="Enter amount" />
                                    </div>

                                    <div className="mt-1 space-y-2 self-center flex justify-center">
                                        <select className="h-12 px-2" onChange={(e) => setBank(e.target.value)}>
                                            <option defaultValue>Choose Bank</option>
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
                                    </div>

                                    <div className="my-1 mt-2 bg-green-100 rounded-sm">
                                        <h4 className="text-center">{bank && ussd}</h4>
                                    </div>

                                    <button type="button" className="mt-2 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => handleCopyCode()}>
                                        Copy Code
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                                <div>
                                    <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { dispatch(setResponse(null)); setOpen(false) }} ref={cancelButtonRef}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
