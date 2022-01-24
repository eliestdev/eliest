import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css';
// import Circle from '../../assets/svg/Circle_med.svg'
import Close from '../../assets/svg/X.svg'

const DownLineModal = ({ active }) => {
    const [open, setOpen] = useState(active)

    const cancelButtonRef = useRef(null)

    const vouchers = [
        { amount: 50, codes: ['0087137', '0087137'], },
        { amount: 100, codes: ['0087137', '0087137'], },
        { amount: 200, codes: ['0087137', '0087137'], },
    ];

    const people = [
        {name: 'Ameh-omale David', active: 'Active since: 24th january, 2021'},
        {name: 'Esther Kanu', active: 'Active since: 24th january, 2021'},
        {name: 'Umar Samu', active: 'Active since: 24th january, 2021'},
        {name: 'Elsjer hameed', active: 'Active since: 24th january, 2021'},
        {name: 'Everest mount', active: 'Active since: 24th january, 2021'},
    ]

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
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-5 sm:p-6 sm:pb-4">
                            <img src={Close} className="mt-2 mb-10 mr-2 close"/>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-6 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Downlines
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                <div className="flex gap-4">
                                                    {/* <img src={Circle} onClick={() => setOpen(false)}/> */}
                                                    <div className="mt-4">
                                                        <h3 className="h3--m">Usman Kamaru</h3>
                                                        <p className="p--m">Active since: 24th january, 2021</p>
                                                    </div>
                                                </div>

                                                <p className="mt-6 dl">All Usman’s downlines</p>
                                                    <div className="downlines mt-8">
                                                        {people.map((p) => (
                                                            <div className="down--list w-full flex rounded h-12 justify-between bg-gray-200 mb-6 items-center content-center mx-auto px-3">
                                                                <span className="lef-name">{p.name}</span>
                                                                <span className="righ-name">{p.active}</span>
                                                            </div>
                                                        ))}
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
}

export default DownLineModal;