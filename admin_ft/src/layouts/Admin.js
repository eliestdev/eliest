import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { Link, useLocation } from "react-router-dom";

import Games from "views/games";
import Values from "views/values";
import Transactions from "views/transactions";
import Administrators from "views/admin";
import Finance from "views/finance";
import FinanceSummary from "views/finance/summary";
import Agents from "views/agents";
import Supervisors from "views/supervisors";
import Targets from "views/targets";
import Assignments from "views/targets/Assignments";
import Wallet from "views/wallet";
import WalletDetail from "views/agents/walletDetails";
import Partners from "views/partners";
import AgentDetail from "views/agents/details";
import SupervisorDetail from "views/supervisors/details";
import ParnerList from "views/partners/list";
import { useDispatch } from "react-redux";
import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import AgentTargets from "views/agents/target";
import ScratchPage from "views/scratch";

function Index() {
  const [sideWidth, setSideWidth] = useState(true);
  const dispatch = useDispatch()
  const sidebarHandler = () => {
    setSideWidth(!sideWidth);
  };

  const [location, setLocation] = useState(window.location.pathname);

  let l = useLocation();

  const sideMenu = [
    { "label": "Games", "to": "/admin/games" },
    { "label": "Values", "to": "/admin/values" },
    { "label": "Transactions", "to": "/admin/transactions" },
    { "label": "Agents", "to": "/admin/agents" },
    { "label": "Agent Targets", "to": "/admin/agent/target" },
    { "label": "Scratch & Play", "to": "/admin/scratch" },
    { "label": "Supervisors", "to": "/admin/supervisors" },
    { "label": "Supervisor Targets", "to": "/admin/targets" },
    { "label": "Target Assignments", "to": "/admin/assignments" },
    { "label": "Default Wallet", "to": "/admin/wallet" },
    { "label": "Partners", "to": "/admin/partners" },
    { "label": "Finances", "to": "/admin/finance" },
    { "label": "Administrators", "to": "/admin/administrators" },
  ]

  useEffect(() => {
    setLocation(window.location.pathname);
  }, [l]);

  return (
    <div className="flex flex-no-wrap min-h-screen">

      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex min-h-screen">
        <div className="px-8">
          <div className="h-16 w-full flex items-center">
            <h3 className="font-extrabold text-gray-50">Eliest Admin</h3>
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
            <h3 className="font-extrabold text-gray-50">Eliest Admin</h3>
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
            <Route path="/admin/games" exact render={() => <Games profile={{}} />} />
            <Route path="/admin/values" exact render={() => <Values profile={{}} />} />
            <Route path="/admin/transactions" exact render={() => <Transactions profile={{}} />} />
            <Route path="/admin/finance" exact render={() => <Finance profile={{}} />} />
            <Route path="/admin/finance/summary" exact render={() => <FinanceSummary profile={{}} />} />
            <Route path="/admin/agents" exact render={() => <Agents profile={{}} />} />
            <Route path="/admin/administrators" exact render={() => <Administrators profile={{}} />} />
            <Route path="/admin/wallet" exact render={() => <Wallet profile={{}} />} />
            <Route path="/admin/partners" exact render={() => <Partners profile={{}} />} />
            <Route path="/admin/supervisors" exact render={() => <Supervisors profile={{}} />} />
            <Route path="/admin/assignments" exact render={() => <Assignments profile={{}} />} />
            <Route path="/admin/targets" exact render={() => <Targets profile={{}} />} />
            <Route path="/admin/partnerlist" exact render={() => <ParnerList profile={{}} />} />
            <Route path="/agent/:id" exact render={() => <AgentDetail profile={{}} />} />
            <Route path="/wallets/:id" exact render={() => <WalletDetail profile={{}} />} />
            <Route path="/supervisor/:id" exact render={() => <SupervisorDetail profile={{}} />} />
            <Route path="/admin/agents/target/:id" exact render={() => <AgentTargets />} />
            <Route path="/admin/scratch" exact component={() => <ScratchPage /> } />
            <Route path="/admin/agent/target" exact component={AgentTargets} />
            <Redirect from="/" to="/admin/games" />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Index;
