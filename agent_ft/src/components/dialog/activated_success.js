import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import x from '../../assets/svg/X.svg'
import Check from '../../assets/svg/CheckCircle.svg'

export default function ActivateSuccess({ visible }) {
    const [open, setOpen] = useState(visible)

    const cancelButtonRef = useRef(null)

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
                        <div className="inline-block align-bottom bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 md:ml-1 sm:text-center">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <img src={Check} className="mb-4 mt-12 content-center icon-center mx-auto" />
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium">
                                            Account activated
                                        </Dialog.Title>
                                        <div className="mt-6">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                You now have full access to the system, carry on with your agent activities
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center mb-4">

                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
