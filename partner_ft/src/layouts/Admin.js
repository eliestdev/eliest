import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";

import Transactions from "views/transactions";
import Finance from "views/finance";
import FinanceSummary from "views/finance/summary";
import Profile from "views/profile";
import Wallet from "views/wallet";
import WalletDetail from "views/agents/walletDetails";
import Partners from "views/partners";
import ParnerList from "views/partners/list";
import { useDispatch } from "react-redux";
import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";


function Index() {
  const [sideWidth, setSideWidth] = useState(true);
  const dispatch = useDispatch()
  const sidebarHandler = () => {
    setSideWidth(!sideWidth);
  };

  const [location, setLocation] = useState(window.location.pathname);

  let l = useLocation();

  const sideMenu = [
    { "label": "Profile", "to": "/admin/profile" },
    { "label": "Wallet", "to": "/admin/wallet" },
    { "label": "Transactions", "to": "/admin/transactions" },
    { "label": "Partners", "to": "/admin/partners" },
    { "label": "Finances", "to": "/admin/finance" },
  ]

  useEffect(() => {
    setLocation(window.location.pathname);
  }, [l]);

  return (
    <div className="flex flex-no-wrap min-h-screen">

      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex min-h-screen">
        <div className="px-8">
          <div className="h-16 w-full flex items-center">
            <h3 className="font-extrabold text-gray-50">Eliest Partners</h3>
          </div>

          <ul className="mt-5 space-y-2">
            {sideMenu.map((element) => (
              <li className={"flex w-full justify-between text-gray-200 text-lg hover:text-gray-500 cursor-pointer items-center mb-6" + (window.location.pathname == element.to &&
                "bg-gray-200  text-green-400 rounded")}>
                <Link to={element.to}>
                  <div className="flex items-center">
                    <span className="ml-2">{element.label}</span>
                  </div>
                </Link>
              </li>
            ))}

            <li className={"flex w-full justify-between text-gray-200 text-lg hover:text-gray-500 cursor-pointer items-center mb-6 py-1"}>
              <a onClick={(e) => {
                e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError(""));
              }}>
                <div className="flex items-center">   <span className="ml-2">Sign Out</span> </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={" z-40 absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out min-h-screen w-64 transform " + (sideWidth == true ? "-translate-x-64" : "")} id="mobile-nav" >
        <div className="h-10 w-10 bg-gray-800 absolute right-0 mt-16 -mr-10 flex items-center shadow rounded-tr rounded-br justify-center cursor-pointer" id="mobile-toggler" onClick={() => sidebarHandler("-translate-x-64")}>

        </div>
        <div className="px-8 ">
          <div className="h-16 w-full flex mt-5 ">
            <h3 className="font-extrabold text-gray-50">Eliest Partners</h3>
          </div>
          <ul className="mt-5">
            {sideMenu.map((element) => (
              <li className={"flex w-full justify-between text-gray-200 text-lg hover:text-gray-500 cursor-pointer items-center mb-6" + (window.location.pathname == element.to &&
                "bg-gray-200  text-green-400 rounded")}>
                <Link to={element.to}>
                  <div className="flex items-center">
                    <span className="ml-2">{element.label}</span>
                  </div>
                </Link>
              </li>
            ))}

            <li className={"flex w-full justify-between text-gray-200 text-lg hover:text-gray-500 cursor-pointer items-center mb-6 py-1"}>
              <a onClick={(e) => {
                e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError(""));
              }}>
                <div className="flex items-center">   <span className="ml-2">Sign Out</span> </div>
              </a>
            </li>

          </ul>
        </div>
        <div className="px-8 border-t border-gray-700"></div>
      </div>

      <div className="container mx-auto py-10  md:w-4/5 w-11/12 px-6">
        <div className="w-full h-full rounded  border-gray-300">
          <Switch>
            <Route path="/admin/profile" exact render={() => <Profile profile={{}} />} />
            <Route path="/admin/transactions" exact render={() => <Transactions profile={{}} />} />
            <Route path="/admin/finance" exact render={() => <Finance profile={{}} />} />
            <Route path="/admin/finance/summary" exact render={() => <FinanceSummary profile={{}} />} />
            <Route path="/admin/wallet" exact render={() => <Wallet profile={{}} />} />
            <Route path="/admin/partners" exact render={() => <Partners profile={{}} />} />
            <Route path="/admin/partnerlist" exact render={() => <ParnerList profile={{}} />} />
            <Route path="/wallets/:id" exact render={() => <WalletDetail profile={{}} />} />
            <Redirect from="/" to="/admin/profile" />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Index;
