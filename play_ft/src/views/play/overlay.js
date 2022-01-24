/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BellIcon, ExclamationIcon } from '@heroicons/react/outline'
import { useDispatch, useSelector } from 'react-redux'
import { toggleGameModal } from 'features/games/gameSlice'
import { PlayUSSD } from 'api/fetch'
import { setLoading } from 'features/games/gameSlice'
import { setResponse } from 'features/games/gameSlice'
import { GetProfile } from 'api/fetch'
import { setProfile } from 'features/authentication/authSlice'

export default function GameAlert({ open, game }) {
  const dispatch = useDispatch()
  const guess = useSelector((state) => state.games.guess) || {}
  const isLoading = useSelector((state) => state.games.loading)
  const response = useSelector((state) => state.games.response)
  const token = useSelector((state) => state.auth.token)
  const profile = useSelector((state) => state.auth.profile)

  const cancelButtonRef = useRef(null)

  const setOpen = () => {
    dispatch(toggleGameModal())
  }

  const playGame = async () => {
    dispatch(setLoading(true))
    var data

    try {
      const res = await PlayUSSD(profile.msisdn, `${guess[0]}#${guess[1]}`, game.id)
      data = await res.json()
      if (!data.error) {
        dispatch(setResponse("CONGRATULATION! you won, your wallet has been credited!"))
      } else {
        dispatch(setResponse(data.error))
      }
    } catch (e) {
      console.log(e)
    } finally {
      dispatch(setLoading(false))
      getProfile()
    }
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
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Confirm to continue
                    </Dialog.Title>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-500">
                        Game: {game.test}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stake: {game.cost}
                      </p>
                      <p className="text-sm text-gray-500">
                        Lucky Numbers: {guess[0]} {guess[1]}
                      </p>
                    </div>
                    <div className="mt-2 space-y-2 self-center flex justify-center">
                    </div>
                  </div>
                </div>

                <div className="sm:flex sm:items-start mt-3 bg-green-50 p-2">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <BellIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>

                  <div className="mt-3 flex text-center sm:mt-0 sm:ml-4 sm:text-left w-full self-center">
                    <Dialog.Title as="h3" className="text-lg  font-medium text-gray-900 ">
                      { !isLoading && response + " 🙂 🙃"}
                    </Dialog.Title>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                <div>
                  <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => playGame()}  > {response ? "Play Again" : "Play Now"} </button>
                  <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => { dispatch(setResponse(null)); setOpen(false) }} ref={cancelButtonRef}>
                    Cancel
                  </button>
                </div>
                {isLoading && <i className="fas fa-circle-notch fa-spin text-green-600 text-3xl text-center"></i>}
              </div>
            </div>

          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
