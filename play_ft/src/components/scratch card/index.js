import ScratchCard from 'react-scratchcard';
import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Grey from '../../assets/img/gem_bg.webp'
import './index.css'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux';
import { PlayScratch } from 'api/fetch';
import { setLoading } from 'features/games/gameSlice'
import { setResponse } from 'features/games/gameSlice'
import { GetProfile } from 'api/fetch'
import { setProfile } from 'features/authentication/authSlice'
import { GetScratchGames } from 'api/fetch';
import ThumbsTrans from '../../assets/img/thumb.png'
// import Hand from '../../assets/img/thumbs_trans.png'
import Diamond from '../../assets/img/diamond.jfif'

const ADMIN_ENDPOINT = process.env.REACT_APP_ENDPOINT_URL
const USSD_ENDPOINT = process.env.REACT_APP_USSD_ENDPOINT

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const SCard = ({ open, setOpen }) => {
    const [denominations, setDenominations] = useState(null);
    let profile = useSelector((state) => state.auth.profile);
    const isLoading = useSelector((state) => state.games.loading)

    const dispatch = useDispatch()
    const getAmount = async () => {
        const res = await GetScratchGames()
        let data = await res.json()

        setDenominations(data.data)
    }

    const [scratched, setScratched] = useState(false)
    const cancelButtonRef = useRef(null)

    const [chosenAmount, setChosenAmount] = useState({ id: "" })
    const [card, setCard] = useState(null)
    const [response, setResponse] = useState(null)

    const settings = {
        height: 250,
        image: Grey,
        finishPercent: 100,
        onComplete: () => { setCard(null) }
    };

    useEffect(() =>
        getAmount(),
        [])

    const emojis = ['😀', '🙂', '🤗', '🤗']

    const play = () => {

    }
    const playGame = async () => {
        if (chosenAmount.id === "") {
            return
        }
        setCard(null)

        dispatch(setLoading(true))
        var data

        try {
            const res = await PlayScratch(profile.msisdn, ``, chosenAmount.id)
            data = await res.json()
            if (!data.error) {
                dispatch(setResponse("CONGRATULATION! you won, your wallet has been credited!"))
            } else {
                //dispatch(setFundResponse(data.error))
            }
        } catch (e) {
            console.log(e)
        } finally {
            dispatch(setLoading(false))
            setResponse(data)
            setCard(true)
            // getProfile()
            setChosenAmount({ id: "" })

        }
    }
    const handleClose = () => {
        setCard(null)
        setChosenAmount({ id: "" })
    }
    const playAgain = () => {
        setCard(null)
    }


    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={() => { handleClose(); setOpen(); }}>
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
                            <div className="bg-green-900  pt-5 pb-4  sm:pb-4" style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 sm:mt-0  sm:text-left w-full">
                                        <div className="mt-3 md:mb-4 flex justify-center">
                                            <div>
                                                <div className="trophy">
                                                    <img src={ThumbsTrans} />
                                                </div>
                                                <div className="item-center text-center text-2xl text-white mt-3 mb-2">Scratch and win</div>
                                                {chosenAmount.id == "" ? <div className="item-start text-xl mt-4 mb-2 text-white">Choose the amount you want to use: </div> : <p className="bg-green-500 px-4 md:py-2 text-white ml-2 rounded-3xl items-center content-center justify-center text-center">Play {chosenAmount.amount} - win {chosenAmount.won}</p>}
                                                <div className="py-3 flex w-full justify-center">
                                                    {denominations && <div className={chosenAmount.id === "" ? "py-3 flex " : "py-3 flex "}>
                                                        {denominations.map((den) => (
                                                            <div onClick={(e) => setChosenAmount(den)} className={"flex flex-col" + (den.id == chosenAmount.id ? " bg-red-500" : " bg-red-100")}>
                                                                <span className="cursor-pointer bg-green-500 px-3 py-1 text-white hover:bg-black hover:text-white text-center">{den.amount}</span>
                                                                <span className="cursor-pointer px-3 py-1 text-white hover:bg-black hover:text-white border-t-2">{den.won}</span>
                                                            </div>
                                                        ))}
                                                    </div>}
                                                </div>
                                                <div className="flex justify-center mt-3">
                                                    <button onClick={() => playGame()} className="self-center p-2 bg-green-700 hover:bg-green-800 rounded-lg px-5 text-white">{response ? "Play" : "Get Scratch Card"}</button>
                                                </div>
                                                <div className="flex justify-center self-center">
                                                    {isLoading && <i class="fas fa-circle-notch fa-spin text-2xl text-green-500 text-center self-center"></i>}
                                                </div>
                                            </div>

                                        </div>


                                        <div className={"w-full " + (card != null && !scratched ? " mb-6" : " mb-16")}>
                                            {card != null && !scratched && <h3 className="text-center font-md mt-5 text-white text-lg mb-3">Scratch your card</h3>}
                                            {card != null && <div className="w-full">
                                                <ScratchCard {...settings} style={{ width: "100%" }}>
                                                    <div className="flex flex-col mx-auto">
                                                        <img className="h-20 w-20 rounded-full self-center" src={Diamond} />
                                                        {response.message !== "TRY AGAIN" && <div className="text-xl text-white text-center w-full ">{response.message}</div>}
                                                        <div className="text-white mt-1 w-full text-center">{response.data}</div>
                                                    </div>

                                                </ScratchCard>
                                                <div className="flex justify-center mt-3">
                                                    <button onClick={() => playAgain()} className="self-center p-2 bg-green-700 hover:bg-green-800 rounded-lg px-5 text-white">Play Again</button>
                                                </div>
                                            </div>
                                            }
                                        </div>
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