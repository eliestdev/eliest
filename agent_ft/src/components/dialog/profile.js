import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import './index.css'
import x from '../../assets/svg/X.svg'
import Account from '../../assets/svg/Account.svg'
import { changeProfile } from './api'
import { uploadFile } from 'api/upload'

export default function Profile({ open, setOpen, profile }) {
    const cancelButtonRef = useRef(null)
    const inputFile = useRef(null)

    const [data, setData] = useState({
        phone: 0,
        address: '',
        loading: false
    })

    const changeField = (e) => setData({ ...data, [e.target.name]: e.target.value })

    useEffect(() => {
        setData({ ...data, phone: profile.phone, address: profile.address })
    }, [])

    const save = async () => {
        const res = await changeProfile(profile.id, data.phone, data.address, profile.image);
        setOpen(false)
    }

    const fileChange = async (e) => {
        try {
            setData({ ...data, loading: true })
            const file = e.target.files[0]

            if (file.size > 1024 * 1024 * 5) {
                alert('Max Size is 5mb')
            } else {
                const image = await uploadFile(file)
                await changeProfile(profile.id, data.phone, data.address, image.ref);
                setOpen(false)
                window.location.reload()
            }
        } catch (e) {
            alert(e.message)
        } finally {
            setData({ ...data, loading: false })
        }
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
                                            Profile
                                        </Dialog.Title>
                                        <div className="mt-6 w-full">
                                            <p className="text-sm text-gray-500 dialog--subtitle">
                                                <div className="flex mb-6">
                                                    {data.loading && <div className="mt-2">
                                                        <svg class="animate-bounce w-6 h-6 text-amber-900" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                                                        </svg> Uploading...
                                                    </div>}

                                                    <input onChange={fileChange} type='file' id='file' ref={inputFile} style={{ display: 'none' }} accept="image/*" />


                                                    {!data.loading && <img className="rounded-full bg-cover bg-no-repeat" src={profile.image === null || profile.image === '' ? Account : profile.image} width={90} height={90} onClick={(e) => inputFile.current.click()} />
                                                    }

                                                    <div className="items-center content-center mt-4 ml-4">
                                                        <div className="profile--name">{profile.lastname} {profile.firstname}</div>
                                                        <div className="profile--active">{new Date(profile.created_at * 1000).toLocaleDateString()}</div>
                                                    </div>

                                                    {/* <button className="h-10 ml-4 mt-4 nav-button bg-red-500 hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                                                        Activate
                                                    </button> */}
                                                </div>

                                                <div className="py-1 items:start">
                                                    <div className="field--label">Phone number</div>
                                                    <div className="flex gap-5">
                                                        <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="text"
                                                            required
                                                            name="phone"
                                                            placeholder={profile.phone}
                                                            onChange={changeField}
                                                            value={data.phone}
                                                        />
                                                        {/* <button className="text-yellow-500">Edit</button> */}
                                                    </div>
                                                </div>

                                                <div className="py-3 items:start">
                                                    <div className="field--label">Address</div>
                                                    <div className="flex gap-5">
                                                        <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" type="address"
                                                            required
                                                            name="address"
                                                            placeholder={profile.address}
                                                            onChange={changeField}
                                                            value={data.address}
                                                        />
                                                        {/* <button className="text-yellow-500">Edit</button> */}
                                                    </div>
                                                </div>

                                                <div className="py-3 items:start">
                                                    <div className="field--label">Referral code</div>
                                                    <div className="flex gap-5 justify-between ml-2">
                                                        <span className="referral-code">{profile.refcode}</span>
                                                        <button onClick={() => { navigator.clipboard.writeText(profile.refcode); alert("copied to clip board") }} className="text-white px-6 py-2 btn-primary rounded">Copy</button>
                                                    </div>
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 mb-4">
                                <button
                                    style={{ width: '94%' }}
                                    type="button"
                                    className="h-14 inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-4 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={save}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
