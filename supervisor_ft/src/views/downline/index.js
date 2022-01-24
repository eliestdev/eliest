import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";

function Index({ profile }) {
  const [ok, setOk] = useState(false);
  const [makeVoucherCall, setMakeVoucherCall] = useState(null);
  const [w, setW] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [direct, setDirect] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  let history = useHistory();

  const getVtu = () => {
    setIsLoading(true);
    setError("");
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/downline`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    })
      .then(async (response) => {
        setIsLoading(false);

        if (!response.ok) {
          throw response;
        }
        let data = await response.json();
        setDirect(data.direct);
      })
      .then((data) => {})
      .catch((e) => {
        console.log(e);
        // e.text().then((errorMessage) => {
        //   setError(errorMessage);
        // });
      });
  };

  const getDownlineCount = (agent) => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/downline`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw response;
        }
        let data = await response.json();
        return data.direct.length;
      })
      .catch((e) => {
        return 0;
      });
  };

  useEffect(() => {
    getVtu();
    return () => {};
  }, []);

  return (
    <>
      {profile && !profile.account_verified ? (
        <Inactive />
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
            <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
              <p className="text-lg text-gray-800 dark:text-gray-100 pb-3 font-semibold">
                Your direct downline: {direct.length}
              </p>
              <div className="mt-5 md:mt-0 md:col-span-2">
                {direct.map( (agent) => {
                  return <AgentItem agent={agent} token={token}/>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Index;

const AgentItem = ({ agent, token }) => {
  const [following, setFollowing] = useState(0);

  const getDownlineCount = (agent) => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/downline?aid=${agent}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",

        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw response;
        }
        let data = await response.json();
        setFollowing(data.direct.length)
      })
      .catch((e) => {
        return 0;
      });
  };

  useEffect(() => {
    getDownlineCount(agent.refcode)
    return () => {
    };
  }, []);

  return (
    <div className="py-2 my-2 bg-white dark:bg-gray-800 rounded-md">
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md relative">
        <div className="flex py-1">
          <div className="px-4 py-6 border-r border-gray-200 dark:border-gray-800">
            <svg
              width={49}
              height={38}
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            ></svg>
          </div>
          <div className="flex flex-1 flex-col justify-center pl-3 text-gray-800 dark:text-gray-100">
            <p cl assName="text-sm font-bold pb-1">
              {agent.lastname} {agent.firstname}  <span className="text-green-400 text-xs"> {following} downline(s)</span>
            </p>
            <div className=" flex flex-col sm:flex-row items-start sm:items-center">
              <p className="text-xs leading-5">
                Joined: {new Date(agent.created_at * 1000).toLocaleDateString()}
              </p>
            </div>         
          </div>
        </div>
      </div>
    </div>
  );
};
