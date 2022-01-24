import { setAuthError } from 'features/authentication/authSlice';
import { removeAuthToken } from 'features/authentication/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Wave from '../../assets/img/wave.png'
import { MenuIcon } from '@heroicons/react/outline'
import { showSideBar, showWinningModal } from 'features/utils/utilSlice';
import { getToken } from '../../endpoint'
import WinningCode from 'components/modal/winning_code';
import ActivateSuccess from '../dialog/activated_success'
import { useState } from 'react';
import './index.css'

const DashboardHeader = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.auth.profile);
    const mobileBar = useSelector((state) => state.utility.mobileBar);
    const winningCodeModal = useSelector((state) => state.utility.winningCodeModal);

    const [activatedDialog, setActivatedDialog] = useState(false)

    const activateAccount = async () => {
        const token = getToken();
        const AGENT_ENDPOINT = process.env.REACT_APP_AGENTS_ENDPOINT
        const url = `${AGENT_ENDPOINT}agent/activate`

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
            const data = await res.json();

            if(data.status === "ERROR") {
                alert(data.message)
            }

            if(data.status === "SUCCESS") {
                setActivatedDialog(true)
            }

            console.log(data)
            
        } catch (e) {
            const message = e.message;
            alert(message);
        }
    }

    const showModal = () => dispatch(showWinningModal(!winningCodeModal))

    const closeModal = () => dispatch(showWinningModal(false))

    return (
        <>
            <WinningCode open={winningCodeModal} setOpen={closeModal}/>
            <ActivateSuccess visible={activatedDialog} />
            <div className="header-bg" style={{ backgroundImage: `url(${Wave})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="flex justify-between py-8 px-12 header-bg">
                    <div className="cursor-pointer block sm:hidden" onClick={() => { dispatch(showSideBar(!mobileBar)) }} >
                        <MenuIcon className="h-8 w-8 " />
                    </div>
                    <div className="">
                        <div className="welcome-back">Welcome back</div>
                        <div className="agent-name">
                            {profile.firstname}
                            <div className="mt-3 text-center content-center items-center chip h-12 small px-3 py-1 bg-green-400 text-white rounded-2xl">{profile.activated ? "Paying Agent" : "Non paying agent"}</div>
                        </div>
                    </div>
                    <div className="md:flex gap-4 h-12 pt-1 mt-1">
                        <button onClick={(e) => { e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError("")) }} className="nav-button bg-red-500 hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Sign Out
                        </button>
                        {!profile.activated && <button onClick={() => activateAccount()} className="mt-5 md:mt-0 nav-button bg-red-500 hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                            Activate account
                        </button>}
                    </div>
                </div>
                {/* <div className="absolute top-28 right-20 flex flex-end">
                    <button className="bg-green-500 text-white rounded py-2 px-10" onClick={() => showModal()}>Enter Winning Code</button>
                </div> */}
            </div>
        </>
    )
}



export default DashboardHeader;