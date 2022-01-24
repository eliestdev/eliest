import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useSelector, useDispatch } from 'react-redux';
import ellipsedRectangle from '../../assets/svg/Subtract.svg'
import './play.css'
import { setGames } from 'features/agentplay/playslice';
import { addError } from 'features/agentplay/playslice';
import { setGuess } from 'features/agentplay/playslice';
import { clearErrors } from 'features/agentplay/playslice';
import { setSelected } from 'features/agentplay/playslice';
import { discardGuess } from 'features/agentplay/playslice';
import { setResponse } from 'features/agentplay/playslice';
import { setLoading } from 'features/agentplay/playslice';

const PlayModal = ({ open, setOpen }) => {
    const cancelButtonRef = useRef(null)

    const dispatch = useDispatch()
    const numbers = Array(90).fill(null);
    const games = useSelector((state) => state.play.games)
    let profile = useSelector((state) => state.auth.profile);
    const isLoading = useSelector((state) => state.play.loading)
    const response = useSelector((state) => state.play.response)

    const guess = useSelector((state) => state.play.guess)
    const selected = useSelector((state) => state.play.selected) || {}

    const handleSetGuess = (i) => {
        const guess = i + 1
        if (!selected)
            dispatch(addError("Choose one of the game to play"))
        else
            dispatch(setGuess(guess))
    }

    const handleSelectGame = (game) => {
        dispatch(clearErrors())
        dispatch(setSelected(game))
    }

    const handleGamePlay = async () => {
        var data

        if (guess.includes(0) || guess[0] === guess[1])
            dispatch(addError("Choose a game to play and select two different numbers"))
        else {
            try {
                dispatch(setLoading(true))

                const res = await PlayUSSD(profile.phone, `${guess[0]}#${guess[1]}`, selected.id)
                data = await res.json()
                if (!data.error) {
                    dispatch(setResponse("CONGRATULATION! You won, your winning wallet has been funded!"))
                } else {
                    dispatch(setResponse(data.error))
                }
            } catch (e) {
                console.log(e)
            } finally {
                dispatch(setLoading(false))
            }

        }
    }
    const handleGuessDiscard = () => {
        dispatch(discardGuess())
        setOpen(false)
    }

    const getGames = async () => {
        try {
            const result = await fetch(`${process.env.REACT_APP_USSD_ENDPOINT}v1/games/list`)
            const data = await result.json()
            dispatch(setGames(data))
        } catch (e) {
            dispatch(addError("Could not find any game at this moment"))
        }
    }


    const PlayUSSD = (number, guess, game) => {
        return fetch(
            `${process.env.REACT_APP_USSD_ENDPOINT}v1/play`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    msisdn: number,
                    game_id: game,
                    guess,
                    agent: true
                }),
            }
        );
    }

    const res = [5000, 10000, 20000, 40000, 50000]

    useEffect(() => getGames(), [open])

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
                        enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Play
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="">
                                                <div className="w-full">
                                                    <span className="vouch">Choose a game and 2 different numbers to play</span>

                                                    <div className="pt-4 ml-1 justify-center items-center grid grid-cols-5 gap-3">
                                                        {games.map((value) =>
                                                            <div className={"flex flex-col" + (value.id == selected.id ? " bg-red-500" : " bg-red-100")}>
                                                                <span className="bg-green-500 px-3 py-1 text-white hover:bg-black hover:text-white text-center" onClick={() => handleSelectGame(value)}>{value.cost}</span>
                                                                <span className="px-3 py-1 text-white hover:bg-black hover:text-white border-t-2">{value.winningAmount}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="pt-4 ml-1 flex justify-center space-x-5">
                                                        {guess.map(value =>
                                                            <span className="bg-gray-800 rounded-full flex items-center justify-center px-5 py-2 text-white cursor">{value}</span>
                                                        )}
                                                    </div>


                                                    <div style={{ backgroundImage: `url(${ellipsedRectangle})` }} className="mt-6 mb-6 px-4 h-auto">
                                                        <div className="grid grid-cols-10 gap-3 py-4">
                                                            {numbers.map((n, i) => {
                                                                return <span className="bg-gray-200 rounded-full flex items-center justify-center px-2 cursor-pointer" onClick={() => handleSetGuess(i)}>{i + 1}</span>
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex text-center sm:mt-0 sm:ml-4 sm:text-left w-full self-center">
                                                        {isLoading && <i className="fas fa-circle-notch fa-spin text-green-600 text-3xl text-center"></i>}

                                                        <h3 className="text-lg  font-medium text-gray-900 ">
                                                            {!isLoading && response + " 🙂 🙃"}
                                                        </h3>
                                                    </div>
                                                    <div className="flex justify-end gap-3 mt-6">
                                                        <button class="tbutton bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded" onClick={() => handleGuessDiscard()}>
                                                            Dismiss
                                                        </button>
                                                        <button className="tbutton bg-green-500 hover:bg-green-500 text-white font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" onClick={() => handleGamePlay()}>
                                                            Play game
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
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

export default PlayModal;