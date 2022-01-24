
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";

import Wallets from "views/wallets";
import Voucher from "views/voucher";
import Profile from "views/profile";
import Settings from "views/settings";
import Vtu from "views/vtu";
import DownLine from "views/downline";
import CoralPayModal from "components/modal/coralpay";
import DebitModal from "components/modal/debitmodal";
import WalletDetail from "views/wallets/detail";
import VoucherBatches from "views/voucher/batches";
import VoucherPrint from "views/voucher/print";
import logo from "assets/img/eliest.png"
import { CloseIcons, MenuIcon } from "./icons";
import Header from "./Header";

import { getUser } from "./api";
import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";

function Index() {
  const [show, setShow] = useState(false);
  const [coralModal, setCoralModal] = useState(false);
  const [debitModal, setDebitModal] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);
  const [location, setLocation] = useState(window.location.pathname);
  const [profile, setProfile] = useState(null);

  let l = useLocation();

  useEffect(() => {
    setLocation(l.pathname)
  }, [l]);


  const dispatch = useDispatch();
  const history = useHistory();

 


  const MenuItem = [
    {
      label: "Wallets",
      icon: "",
      component: "",
      to: "/agent/wallets",
      render: profile ? <Wallets user={profile} /> : <></>
    },
    {
      label: "Profile",
      icon: "",
      component: "",
      to: "/agent/profile",
      render: profile && <Profile user={profile} />
    },
   
    {
      label: "Vouchers",
      icon: "",
      component: "",
      to: "/agent/vouchers",
      render: profile && <Voucher user={profile} />
    },
    {
      label: "Voucher Batches",
      icon: "",
      component: "",
      to: "/agent/voucher_batches",
      render: <VoucherBatches profile={profile} />
    },
    {
      label: "Downlines",
      icon: "",
      component: "",
      to: "/agent/downline",
      render: <DownLine profile={profile} />
    },
    {
      label: "",
      icon: "",
      component: "",
      to: "/agent/settings",
      render: profile && <Settings profile={profile} />
    },
    {
      label: "",
      icon: "",
      component: "",
      to: "/agent/wallet/:walletId",
      render: profile && <WalletDetail profile={profile} />
    },
    {
      label: "",
      icon: "",
      component: "",
      to: "/agent/vtu",
      render: profile && <Vtu profile={profile} />
    },
  ]

  return (
    <div>
      <div className={show ? "w-full h-full absolute z-40  transform  translate-x-0 " : "   w-full h-full absolute z-40  transform -translate-x-full"}>
        <div className="bg-gray-800 opacity-50 inset-0 fixed w-full h-full"
          onClick={() => setShow(!show)}
        />
        <div className="w-64  absolute left-0 z-40 top-0 bg-gray-800 shadow flex-col justify-between transition duration-150 ease-in-out h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="px-6 pt-4">
              <div className="flex items-center justify-end">
                <div id="cross" className=" text-white" onClick={() => setShow(!show)}>
                  <CloseIcons />
                </div>
              </div>
              <ul className="f-m-m">
                {
                  MenuItem.map(item =>
                    <Link to={item.to}>
                      <li className="text-white pt-8">
                        <div className="flex items-center">
                          <div className="md:w-6 md:h-6 w-5 h-5">
                            <MenuIcon />
                          </div>
                          <p className="text-indigo-500 ml-3 text-lg">{item.label}</p>
                        </div>
                      </li>
                    </Link>
                  )
                }
              </ul>
            </div>
          </div>
        </div>
      </div>

      <nav className="w-full mx-auto bg-gray-800 border-b border-gray-700 shadow relative z-20">
        <div className="container px-6 h-16 flex items-center justify-center mx-auto">
          <ul className="flex items-center justify-center h-full">
            <li className="mx-0 xl:mx-12 cursor-pointer">
              <img src={logo} alt="logo" style={{ height: 60, width: 93 }} />
            </li>
          </ul>
          <div onClick={() => setShow(!show)} className="xl:hidden">
            <svg aria-label="Main Menu" aria-haspopup="true"
              xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu"
              width={32} height={32} viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1={4} y1={8} x2={20} y2={8} />
              <line x1={4} y1={16} x2={20} y2={16} />
            </svg>
          </div>
        </div>
      </nav>

      {profile && <Header user={profile} coralModal={coralModal} setCoralModal={setCoralModal} debitModal={debitModal} setDebitModal={setDebitModal} setAmountToPay={setAmountToPay} />}

      <div className="bg-gray-200 pb-10 h-screen">
        <div className="container px-6 mx-auto">
          <div className="relative z-10 w-full">
            <div className="w-full -mt-8 h-auto">
              <div className="w-full h-auto lg:h-20 mb-6 rounded shadow bg-white">
                <div className="lg:hidden bg-white w-full relative">
                  <div className="absolute inset-0 m-auto mr-4 z-0 w-6 h-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-selector"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#A0AEC0"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <polyline points="8 9 12 5 16 9" />
                      <polyline points="16 15 12 19 8 15" />
                    </svg>
                  </div>
                  <select aria-label="Selected tab"
                    onChange={(e) => { e.preventDefault(); history.push(e.target.value); }}
                    className="form-select block w-full p-3 border border-gray-300 rounded text-gray-600 appearance-none bg-transparent relative z-10"
                  >
                    {MenuItem.map(item =>
                      <option key={item.to} value={location == item.to} value={item.to} className="text-sm text-gray-600" >
                        {item.label}
                      </option>
                    )}
                  </select>
                </div>
                <ul className="hidden lg:flex flex-row items-center h-full space-x-4">
                  {MenuItem.map(item =>
                    <li className={"ml-4 my-2 lg:my-0 rounded text-base text-gray-800 px-4 " + (location == item.to ? "bg-gray-200 px-4 py-1 rounded" : "")}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  )}
                </ul>
              </div>

              <div className="container mx-auto">
                <div className="bg-white w-full h-full rounded shadow py-10 px-5">
                  <Switch>
                    {MenuItem.map(item =>
                      <Route
                        path={item.to}
                        exact
                        render={() => item.render}
                      />

                    )}
                    <Route
                      path="/agent/wallet/:walletId"
                      exact
                      render={profile && <WalletDetail profile={profile} />
                      }
                    />

                    <Route
                      path="/agent/voucher_print"
                      exact
                      render={() => <VoucherPrint profile={profile} />}
                    />
                    <Redirect from="/" to="/agent/wallets" />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
