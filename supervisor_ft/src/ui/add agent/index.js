import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import x from '../../assets/svg/X.svg'
import { submitNonAssign } from './api'

export default function ProfileModal({ open, setOpen, profile }) {
    const [refCode, setRefCode] = useState(null)
    const [payload, setPayload] = useState(null)
    const cancelButtonRef = useRef(null)

    const save = async () => {
        const res = await submitNonAssign(refCode)
        setPayload(res)
    }

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
                                            Submit an Agent
                                        </Dialog.Title>
                                        <div className="mt-2 w-full">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                <div className="mb-6">
                                                    {!profile.is_auto_assign &&  <div className="w-full px-1">
                                                        <div className="flex items-start content-start py-2">Agent Ref Code</div>
                                                        <input style={{ width: '100%' }} placeholder="Agent Ref Code e.g.1234567" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 dark:focus:border-green-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" value={refCode} onChange={(e) => setRefCode(e.target.value)} />
                                                    </div>
                                                    }
                                                   
                                                   {profile.is_auto_assign && <div className="font-semibold py-3">This feature is only for the non-paying supervisors</div>}
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!profile.is_auto_assign && payload && <div className={"py-8 " + payload.status ? " text-red-500" : " text-green-500"}>{payload.message}</div>}
                            {!profile.is_auto_assign && payload && payload.status !== "SUCCESS" || payload == null && !profile.is_auto_assign && <div className="px-4 py-3 sm:px-6 mb-4">
                                <button
                                    onClick={save}
                                    style={{ width: '94%' }}
                                    type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Submit
                                </button>
                            </div>
                            }
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
