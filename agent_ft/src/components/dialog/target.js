import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import Account from '../../assets/svg/Account.svg'
import { createTarget, getMyTarget, getGlobalTarget } from './api'
import { useHistory } from 'react-router'


export default function Target({ open, setOpen }) {
    const cancelButtonRef = useRef(null)
    const history = useHistory()

    const [confirm, setConfirm] = useState(false);

    const [target, setTarget] = useState({ downline: 10, timeline: 28 });
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [payload, setPayload] = useState({
        minimum: null,
        reward: null,
        hasData: false
    });

    const handleDownline = (e) => {
        setTarget({ ...target, downline: e < 10 ? 10 : Number(e) })
    }
    const handleDeadline = (e) => {
        setTarget({ ...target, timeline: e > 30 ? 30 : e })
    }

    useEffect(async () => {
        try {
            const pay = await getGlobalTarget();
            setPayload({ ...payload, minimum: pay.data[0].minimum, reward: pay.data[0].reward, hasData: true })
            setTarget({ ...target, downline: pay.data[0].minimum })
        } catch (e) {
            return null;
        }
    }, [])

    let newTarget = async () => {
        setIsLoading(true)
        try {
            let response = await createTarget(target)
            if (response.status == "SUCCESS") {
                setResponse("")
                history.push("agent/targets")
            } else {
                setResponse(response.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    const getTarget = async () => {
        const res = await getMyTarget()
        console.log(res)
    }

    // useEffect(() => getTarget(), [])

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {!payload.hasData && <button type="button" class="bg-green-500 inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:border-rose-700 active:bg-rose-700 transition ease-in-out duration-150 cursor-not-allowed" disabled="">
                                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading
                                </button>
                                }

                                {payload.hasData && <div> <div className="flex items-start">
                                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <img className="close" src={x} onClick={() => setOpen(false)} />
                                        <Dialog.Title as="h3" className="pt-10 text-lg leading-6 font-medium dialog--title">
                                            {confirm ? "Are you sure?" : " Set your referral Target"}
                                        </Dialog.Title>
                                    </div>

                                </div>
                                    {confirm && <p className="items-start content-start">
                                        Are you sure about this target? Once Saved, it can't be edited
                                    </p>}
                                    {!confirm && <div className="mt-3 sm:mt-0 sm:ml-4 sm:mr-4 w-full">
                                        <div className="w-full flex justify-between space-x-3 p-2">
                                            <p className="flex-1 self-center text-left  p-3">Target Downline ({payload.minimum} minimum)</p>
                                            <input className="w-32 px-5 bg-transparent border" type="number" name="downline" min={payload.minimum} value={target.downline} onChange={(e) => handleDownline(e.target.value)} />
                                        </div>

                                        <div className="w-full flex justify-between space-x-3 p-2">
                                            <p className="flex-1 self-center text-left  p-3">Given Time (28 Days maximum)</p>
                                            <input readOnly className="w-32 px-5 bg-transparent border text-black" name="timeline" min="1" max="30" value="28 days" />

                                        </div>

                                        <div className="w-full flex justify-between space-x-3 p-2">
                                            <p className="flex-1 self-center text-left  p-3">Reward</p>
                                            <input readOnly className="w-32 px-5 bg-transparent border" type="number" name="reward" value={target.downline * (payload.reward / payload.minimum)}
                                            // onChange={(e) => handleDeadline(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                    }</div>}

                            </div>
                            {isLoading && <i class="fas p-3 text-2xl fa-spinner fa-pulse"></i>}
                            {response && <p>{response}</p>}
                            <div className="px-4 py-3 sm:px-6 mb-4">
                                {!confirm && <button
                                    style={{ width: '94%' }}
                                    type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setConfirm(true)}
                                >
                                    Save and Continue
                                </button>}

                                {confirm && <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:text-red-600 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button

                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => newTarget(false)}
                                    >
                                        Save
                                    </button>
                                </div>}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
