import Wave from '../assets/img/wave.png'
import { MenuIcon } from '@heroicons/react/outline'
import { showSideBar } from 'features/utils/utilSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { removeAuthToken } from 'features/authentication/authSlice';
import { setAuthError } from 'features/authentication/authSlice';
import Batches from '../views/voucher/batches'
import DashboardHeader from 'components/dashboard/header';

const Voucher = () => {
    const dispatch = useDispatch();
    let history = useHistory();
    const mobileBar = useSelector((state) => state.utility.mobileBar);

    const showProfile = useSelector((state) => state.auth.showProfile);
    const profile = useSelector((state) => state.auth.profile);

    return (
        <div>
            <DashboardHeader />

            <Batches profile={profile} />

            {/* <TopUp active={true} /> */}
            {/* <GetVoucher active={true} /> */}
            {/* <DownTime /> */}
            {/* <DownLineModal active={true} /> */}
            {/* <Table /> */}
        </div>
    );
}

export default Voucher;