import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/index.css";
import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import Auth from 'layouts/Auth';
import { selectToken } from 'features/authentication/authSlice';
import Dashboard from 'ui/Dashboard';
import Transactions from 'views/transactions';
import DashboardNav from 'components/dashboard/nav'
import DownLinePage from 'ui/downlinePage';
import Targets from 'ui/targetPage';
import Vouchers from 'ui/Vouchers';
import Profile from 'components/dialog/profile';
import GetVouchers from 'components/dialog/get_vouchers';
import { setShowProfile } from 'features/authentication/authSlice';
import { showGetVoucher } from 'features/utils/utilSlice';
import VoucherPrint from "views/voucher/print";
import { showSeeTargets } from 'features/utils/utilSlice';
import PlayModal from 'components/modal/play';
import { showPlayModal } from 'features/utils/utilSlice';
import { showScratchModal } from 'features/utils/utilSlice';
import DownlineDetails from 'views/downline/details';

function App(props) {
  const token = useSelector(selectToken);
  let showProfile = useSelector((state) => state.auth.showProfile);
  let getVoucher = useSelector((state) => state.utility.getVoucher);
  let profile = useSelector((state) => state.auth.profile);
  let showPlay = useSelector((state) => state.utility.playModal);
  let showScratch = useSelector((state) => state.utility.scratchModal);

  const dispatch = useDispatch()

  const setProfile = () => {
    dispatch(setShowProfile(!showProfile))
  }

  const setNewVoucher = () => {
    dispatch(showGetVoucher(!getVoucher))
  }

  const setPlayModal = () => {
    dispatch(showPlayModal(!showPlay))
  }
  const setScratchModal = () => {
    dispatch(showScratchModal(!showScratch))
  }
  const mobileBar = useSelector((state) => state.utility.mobileBar);

  const rootRef = useRef(null);

  useEffect(() => {
      if(showScratch && rootRef.current){
        rootRef.current.style.overflow = 'hidden';
      }else if(
        !showScratch && rootRef.current
      ){
        rootRef.current.style.overflow = 'unset';

      }
  }, [showScratch])

  
  return (
    <>
      {token ? (
        <BrowserRouter >
          <div className="flex w-full" ref={rootRef} >
            <DashboardNav />
            <div className="flex-1">
              <Switch>
                <Route path="/" exact>
                  <Dashboard />
                </Route>
                <Route path="/agent/transactions" component={Transactions} />
                <Route path="/agent/downline" component={DownLinePage} />
                <Route path="/downline/:id" component={DownlineDetails} />
                <Route path="/agent/vouchers" component={Vouchers} />
                <Route path="/agent/targets" component={Targets} />
                <Route
                  path="/agent/voucher_print"
                  exact
                  render={() => <VoucherPrint profile={profile} />}
                />
              </Switch>

              <GetVouchers open={getVoucher} setOpen={setNewVoucher} />
              <Profile open={showProfile} setOpen={setProfile} profile={profile} />
              <PlayModal open={showPlay} setOpen={setPlayModal} />
            </div>
          </div>
        </BrowserRouter>
      )
        : (
          <BrowserRouter>
            <Switch>
              <Route path="/">
                <Auth />
              </Route>
            </Switch>
          </BrowserRouter>
        )
      }
    </>
  )
}

export default App;
