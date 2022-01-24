import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css';

const GetVoucher = ({ active }) => {
    const [open, setOpen] = useState(active)

    const cancelButtonRef = useRef(null)

    const vouchers = [
        { amount: 50, codes: ['0087137', '0087137'], count: 0 },
        { amount: 100, codes: ['0087137', '0087137'], count: 0 },
        { amount: 200, codes: ['0087137', '0087137'], count: 0 },
    ];

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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Get voucher
                                        </Dialog.Title>
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-500">
                                                {vouchers.map((voucher) => (
                                                    <div className="flex gap-4">
                                                        <div className="lef-v">
                                                            <input type="radio" name="price"/>
                                                            <label htmlFor="price" className="v-label">{voucher.amount}</label>
                                                        </div>
                                                        <div>
                                                            {voucher.count}
                                                        </div>
                                                    </div>
                                                ))}
                                            </p>
                                        </div>
                                        <div className="mt-10 h-12 bg-gray-300 rounded to px-4 flex mx-auto items-center content-center justify-between">
                                            <div className="total">Total</div>
                                            <div className="amount">₦2000.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-50 px-4 py-4 sm:px-6 sm:flex">
                                <button
                                    type="button"
                                    className="btn-primary w-full rounded-md border border-transparent shadow-sm sm:px-4 md:px-48 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Purchase
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default GetVoucher;