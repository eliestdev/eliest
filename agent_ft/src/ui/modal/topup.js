import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import './index.css';

const TopUp = ({ active }) => {
    const [open, setOpen] = useState(active)

    const cancelButtonRef = useRef(null)

    const vouchers = [
        { amount: 50, codes: ['0087137', '0087137'], },
        { amount: 100, codes: ['0087137', '0087137'], },
        { amount: 200, codes: ['0087137', '0087137'], },
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
                                            Voucher batch summary
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                <Accordion>
                                                    {vouchers.map((voucher) => (
                                                        <AccordionItem className="w-full">
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>
                                                                    <input type="radio" name="amount" />
                                                                    <label htmlFor="amount" className="v-label">
                                                                        N{voucher.amount}
                                                                    </label>
                                                                </AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel>
                                                                <p>
                                                                    List of ₦{voucher.amount} vouchers

                                                                    {voucher.codes.map((code) => (
                                                                        <div className="flex gap-4 mt-5">
                                                                            <div className="code">{code}</div>
                                                                            <button className="rounded py-2 px-6 border border-yellow-500 text-yellow-500">Copy code</button>
                                                                        </div>
                                                                    ))}
                                                                </p>
                                                            </AccordionItemPanel>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
                                <button
                                    type="button"
                                    className="btn-primary w-full rounded-md border border-transparent shadow-sm sm:px-4 md:px-44 py-2 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setOpen(false)}
                                >
                                    Print vouchers
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default TopUp;