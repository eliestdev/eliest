import Wave from '../assets/img/wave.png'
import { MenuIcon } from '@heroicons/react/outline'
import { showSideBar } from 'features/utils/utilSlice';
import { useEffect } from 'react';
import { setProfile } from 'features/authentication/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getWallets } from '../ui/api';
import { useHistory } from 'react-router';
import { removeAuthToken } from 'features/authentication/authSlice';
import { setAuthError } from 'features/authentication/authSlice';
import Target from '../views/targets'

const DownLinePage = () => {
    const dispatch = useDispatch();
    let history = useHistory();

    const mobileBar = useSelector((state) => state.utility.mobileBar);

    const showProfile = useSelector((state) => state.auth.showProfile);
    const profile = useSelector((state) => state.auth.profile);

    
    let getProfile = async () => {
        try {
            let response = await getUser()
            if (response.status == "SUCCESS")
                dispatch(setProfile(response.data.profile))
        } catch (error) {
            console.log(error)
        } finally {

        }
    };

    useEffect(() => {
        getProfile();
        return () => { };
    }, []);

    return (
        <div>
            <div className="header-bg" style={{ backgroundImage: `url(${Wave})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="flex justify-between py-8 px-12 header-bg">
                    <div className="cursor-pointer block sm:hidden" onClick={() => { dispatch(showSideBar(!mobileBar)); }} >
                        <MenuIcon className="h-8 w-8 " />
                    </div>
                    <div>
                        <div className="transaction-header">Targets</div>
                        <div className="transaction-text pt-4">Claim rewards for your completed targets</div>
                    </div>
                    <div className="flex gap-4 h-12 pt-1 mt-1">
                        {profile.activated && <button className="nav-button bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                            Activate account
                        </button>}

                        <button onClick={(e) => { e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError("")) }} className="nav-button bg-red-500 hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div>
               <Target/>
            </div>
        </div>
    )
}

export default DownLinePage;