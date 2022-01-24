import { Link, withRouter } from 'react-router-dom'
import Wallet from '../../assets/svg/Wallet.svg'
import Ticket from '../../assets/svg/Ticket.svg'
import CardHolder from '../../assets/svg/Cardholder.svg'
import Users from '../../assets/svg/Cardholder.svg'
import UserCircle from '../../assets/svg/UserCircle.svg'
import { useEffect } from 'react';
import { setProfile } from 'features/authentication/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getWallets } from '../../ui/api';
import { setShowProfile } from 'features/authentication/authSlice';
import { setWallet } from 'features/authentication/authSlice';
import { useHistory } from 'react-router';
import Logo from '../../assets/img/logo_white.png';
import Play from '../../assets/svg/Play.svg'
import { showGetVoucher, showPlayModal, showScratchModal } from 'features/utils/utilSlice'
import SCard from 'components/scratch card'
import { showSideBar } from 'features/utils/utilSlice'
import './index.css'

const DashboardNav = (props) => {
    const { location } = props;

    const dispatch = useDispatch();
    let history = useHistory();

    const profile = useSelector((state) => state.auth.profile);
    const mobileBar = useSelector((state) => state.utility.mobileBar);
    const scratchCard = useSelector((state) => state.utility.scratchModal);

    const links = [
        { name: 'Play 2 of 90', icon: Play, action: () => dispatch(showPlayModal(true)) },
        { name: 'Scratch & Win', icon: Play, action: () => dispatch(showScratchModal(true)) },
        { name: 'Wallet', icon: Wallet, action: () => history.push('/') },
        { name: 'New Voucher', icon: Ticket, action: () => dispatch(showGetVoucher(true)) },
        { name: 'Voucher Batches', icon: CardHolder, action: () => history.push('/agent/vouchers') },
        { name: 'Downlines', icon: Users, action: () => history.push('/agent/downline') },
        { name: 'Profile', icon: UserCircle, action: () => dispatch(setShowProfile(true)) },
        // { name: 'Targets', icon: UserCircle, action: () => history.push('/agent/targets') }
    ]

    let getUserWallets = async () => {
        try {
            let response = await getWallets(profile)
            if (response.status == "SUCCESS")
                dispatch(setWallet(response.data.wallets))
        } catch (error) {
            console.log(error)
        } finally {

        }
    };

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
        getProfile().then(() => getUserWallets())
        return () => { };
    }, []);


    return (
        <>
        <SCard open={scratchCard} setOpen={() => dispatch(showScratchModal(false))}/>
            <div className={"py-10 px-10 h-screen dash-nav  " + (mobileBar ? " hidden fixed w-full border shadow" : " ")}>
                <Link to="/">
                    <img className="nav-logo" src={Logo} /></Link>
                <div className="links--list">
                    {links.map((link) => (<div key={link.name} className="mb-8 flex cursor-pointer text-white hover:text-gray-900" onClick={() => link.action()}>
                        <img className="mr-4" src={link.icon} />
                        <span className="link">{link.name}</span>
                    </div>))}
                </div>
            </div>
        </>
    )
}

export default withRouter(DashboardNav);