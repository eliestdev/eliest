import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useLocation, useHistory } from "react-router";
import { useEffect } from "react";
import MyWallet from "views/mywallet";
import Activate from "views/myprofile/activate";
import MyTargets from "views/mytargets";
import { getUser } from "./api";
import SupervisorHeader from "components/navbar/SupervisorHeader";
import Dashboard from "ui/dashboard";
import ProfileModal from "ui/profile";
import Details from "ui/dashboard/details";

function Index() {
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  let l = useLocation();

  useEffect(() => {
    setLocation(window.location.pathname)
  }, [l]);

  const dispatch = useDispatch();
  const history = useHistory();
  const [profile, setProfile] = useState(null);

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
        setProfile(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getProfile()
  }, []);

  const links = [
    {
      menuItem: true,
      to: "/my-agents",
      label: "My Agents",
      render: <Dashboard />,
    },
    {
      menuItem: true,
      to: "/profile",
      label: "Profile",
      render: profile && <ProfileModal profile={profile} />,
    },
    {
      menuItem: true,
      to: "/my-targets",
      label: "My Targets",
      render: <MyTargets user={profile} />,
    }, {
      menuItem: false,
      to: "/my-agents/:id",
      label: "My Agents",
      render: <Details />,
    }, , {
      menuItem: true,
      to: "/my-wallet",
      label: "My Wallet",
      render: <MyWallet profile={profile} />,
    }
    , {
      menuItem: false,
      to: "/profile/activate",
      label: "t",
      render: profile && <Activate profile={profile} />,
    }
  ];

  const menu = links.filter(link => link.menuItem == true)

  return (
    <>
      <div className="w-full flex">
        <SupervisorHeader />
        <div className="flex-1">
          <Switch>
            {links.map((link) => (
              <Route
                path={link.to}
                exact
                render={() => link.render}
              />
            ))}

            <Redirect from="/" to="/my-agents" />
          </Switch>
        </div>
      </div>      
    </>
  );
}

export default Index;
