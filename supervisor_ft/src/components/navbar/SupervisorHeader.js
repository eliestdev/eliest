import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo_white.png'
import './index.css'
import AgIcon from '../../assets/svg/Agents.svg'
import Ticket from '../../assets/svg/Ticket.svg'
import Profile from '../../assets/svg/UserCircle.svg'
import Cardholder from '../../assets/svg/Cardholder.svg'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import ProfileModal from '../../ui/profile'
import { getUser } from '../../layouts/api'
import { useDispatch, useSelector } from "react-redux";
import { removeAuthToken } from "../../features/authentication/authSlice";
import { setAuthError } from "../../features/authentication/authSlice";
import { useEffect } from 'react'
import WalletDialog from '../../views/mywallet'
import AddAgentDialog from '../../ui/add agent'
import { autoAssign } from '../../ui/add agent/api'

const SupervisorHeader = () => {
  const [links, setLinks] = useState([
    { name: 'My Agents', icon: AgIcon, action: () => history.push('/') },
    { name: 'My Targets', icon: Ticket, action: () => history.push('/my-targets') },
    // { name: 'My Wallets', icon: Cardholder, action: () => setWallDialog(true) },
    { name: 'Profile', icon: Profile, action: () => setProfileDialog(true) },
    { name: 'Add Agent', icon: AgIcon, action: () => setAddAgent(true) }
  ])

  const history = useHistory();
  const mobileBar = false;

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [wallDialog, setWallDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);

  const [profile, setProfile] = useState(null);

  const [addAgent, setAddAgent] = useState(false)

  let getProfile = async () => {
    setIsLoading(true)
    try {
      let response = await getUser()
      if (response.status != "SUCCESS") {
        if (response.message === "FORBIDDEN" || response.message == "FORBIDDEN") {
          dispatch(removeAuthToken());
          dispatch(setAuthError(""));
        }
      } else {
        console.log(response.data)
        setProfile(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(async () => {
    getProfile()
  }, []);


  return (
    <div>
      {profile && <WalletDialog open={wallDialog} setOpen={setWallDialog} profile={profile} />}
      {profile && <ProfileModal open={profileDialog} setOpen={setProfileDialog} profile={profile} />}
      {profile && <AddAgentDialog open={addAgent} setOpen={setAddAgent} profile={profile} />}
      <div className={"py-10 px-12 h-screen dash-nav" + (mobileBar ? " hidden fixed w-full border shadow" : " ")}>
        <Link to="/">
          <img className="nav-logo" src={Logo} />
        </Link>
        <div className="links--list">
          {links.map((link) => (
            <div key={link.name} className="mb-8 flex cursor-pointer text-white hover:text-gray-900" onClick={() => link.action()}>
              <img className="mr-4" src={link.icon} />
              <span className="link">{link.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupervisorHeader