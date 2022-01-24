import ScratchCard from 'react-scratchcard';
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Wave from '../../assets/img/wave.png'
import Grey from '../../assets/img/gem_bg.webp'
import './index.css'
import emoji from 'react-easy-emoji'
import { HttpGet, HttpPost } from '../../endpoint'
import { useSelector } from 'react-redux';
import { data } from 'autoprefixer';
import { setAuthError } from 'features/authentication/authSlice';
import ThumbsTrans from '../../assets/img/thumb.png'
import Diamond from '../../assets/img/diamond.jfif'

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL
const USSD_ENDPOINT = process.env.REACT_APP_USSD_ENDPOINT

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const SCard = ({ open, setOpen }) => {
    const [denominations, setDenominations] = useState(null);
    let profile = useSelector((state) => state.auth.profile);

    const getAmount = async () => {
        const data = await HttpGet(`${ADMIN_ENDPOINT}agent/scratch/get`)
        setDenominations(data.data)
    }

    const [scratched, setScratched] = useState(false)
    const cancelButtonRef = useRef(null)

    const [chosenAmount, setChosenAmount] = useState({ id: "" })
    const [card, setCard] = useState(null)
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fault, setFault] = useState("");
    const settings = {
        height: 250,
        image: Grey,
        finishPercent: 100,
        onComplete: () => { setCard(null) }
    };

    useEffect(() => getAmount(), [])

    const emojis = ['😀', '🙂', '🤗', '🤗']

    const handleBuyCard = async () => {
        setError("")
        setFault("")

        if (chosenAmount.id == "") {
            setFault("Choose a game to play")
            return
        }
        setLoading(true)
        setCard(null)
        const data = await HttpPost(`${USSD_ENDPOINT}v1/scratch/agent?id=${chosenAmount.id}`, {
            "msisdn": profile.phone,
            "game_id": chosenAmount.id,
            "guess": "scratch",
            "agent": true
        })
        if (data.error) {
            setError(data.error)
            setLoading(false)

            return
        }
        setResponse(data)
        setCard(true)
        setLoading(false)
        setChosenAmount({ id: "" })
    }

    const clearAll = () => {
        setChosenAmount({ id: "" })
        setResponse(null)
        setCard(null)
        setError("")
        setFault("")
    }
    const playAgain = () => {
        setChosenAmount({ id: "" })
        setResponse(null)
        setCard(null)
        setError("")
        setFault("")
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => { document.body.style.overflow = 'unset'; clearAll(); setOpen() }}>
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
                        <div className="inline-block align-bottom bg-green-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-w-full w-full pb-10">
                            <div className="bg-green-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                <div className="">
                                    <div className="mt-3 sm:mt-0 sm:ml-4">
                                        <div>
                                            <div className="trophy">
                                                <img src={ThumbsTrans} />
                                            </div>
                                            <div className="text-center">
                                                <div className="item-center text-center text-2xl text-white mt-3">Scratch and win</div>
                                            </div>

                                            <div className="mt-2">
                                                {chosenAmount.id == "" ? <div className="item-start text-xl mt-4 mb-2 text-white">Choose the amount you want to use: </div> : <p className="bg-green-500 px-4 md:py-2 text-white ml-2 rounded-3xl items-center content-center justify-center text-center">Play {chosenAmount.amount} - win {chosenAmount.won}</p>}
                                                <div className="py-3 flex w-full justify-center">
                                                    {denominations?.map((den) => (
                                                        <div onClick={(e) => { setError(""); setFault(""); setChosenAmount(den) }} className={"flex  flex-col " + (chosenAmount.id == den.id ? " bg-red-500" : " bg-red-100")}>
                                                            <span className="bg-green-500 px-3 py-1 text-white    hover:bg-black hover:text-white text-center">{den.amount}</span>
                                                            <span className=" px-3 py-1 text-white     hover:bg-black hover:text-white border-t-2">{den.won}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-50 text-center">{fault && <p>{fault}</p>}</p>

                                                <div className="flex justify-center">
                                                    <button onClick={() => handleBuyCard()} className="self-center p-2 bg-green-500 rounded-lg px-5 text-white">{response ? "Play Again" : "Get Scratch Card"}</button>
                                                </div>
                                                {error && <p className="text-red-500 text-center text-sm py-2 my-2  font-semibold italic bg-gray-100">{error}</p>}
                                                <div className="flex justify-center self-center">
                                                    {loading && <i class="fas fa-circle-notch fa-spin text-2xl text-green-500 text-center self-center"></i>}
                                                </div>
                                            </div>
                                        </div>


                                        {card != null && !scratched && <h3 className="text-center text-lg text-white mb-3">Scratch your card </h3>}
                                       <div className="w-full">
                                       {card != null && <ScratchCard {...settings} style={{ borderRadius: '', width: "100%", border: "2px solid gray" }}>
                                            <div className="py-1 text-center">
                                                <div className="win mb-3">
                                                    <img className="rounded-full h-20 w-20" src={Diamond} />
                                                </div>
                                                {response.message !== "TRY AGAIN" && <div className="text-white mt-4 text-sm">{response.message}</div>}
                                                <div className="text-white mt-1 text-sm">{response.data}</div>

                                            </div>
                                        </ScratchCard>}
                                       </div>

                                       {card != null && <div className="flex justify-center">
                                            <button onClick={() => playAgain()} className="self-center p-2 bg-green-500 rounded-lg px-5 text-white">Play Again</button>
                                        </div>}
                                       
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default SCard;