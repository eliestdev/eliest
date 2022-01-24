import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";
import { getDownline } from "./api";
import './index.css'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import '../../ui/modal/index.css'
import User from '../../assets/svg/UserCircle.svg'

function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);

  const [direct, setDirect] = useState([]);

  const dispatch = useDispatch();
 
  let getDirectDownlines = async () => {
    setIsLoading(true)
    try {
      let response = await getDownline()
      if (response.status !== "SUCCESS") {
      } else {
        setDirect(response.data.direct)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };


  useEffect(() => {
    getDirectDownlines();
    return () => { };
  }, []);


  return (
    <>
      {!profile.account_verified ? (
        <Inactive />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
            <div className="w-full dark:bg-gray-800 mx-auto downline-center">
              <div className="bg-white h-auto rounded px-6 py-6 border border-0 border-gray-200 w-2/6 mx-auto mb-10">
                <div className="downline--text text-center">Total Downlines</div>
                <p className="downline--count text-center">
                  {direct.length}
                </p>
              </div>
              <Accordion className="mt-5 md:mt-0 grid grid-cols-3 gap-6">
                {direct.map((agent) => {
                  return <AgentItem agent={agent} token={token} />;
                })}
              </Accordion>
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
  let history = useHistory();

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
    return () => { };
  }, []);

  return (
    <AccordionItem className="border border-0 border-gray-200 rounded ml-4 mr-4 py-8 px-4 h-auto" onClick={() => history.push(`/downline/${agent.id}`)}>
      <AccordionItemHeading>
        <AccordionItemButton className="flex gap-3">
          <img src={User} className="mt-5" />
          <div className="d-name">{agent.lastname} {agent.firstname}
            <p className="d-p">Joined: {new Date(agent.created_at * 1000).toLocaleDateString()}</p>
          </div>
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="">
        <div className="mt-10 flex justify-center gap-4">
          <div className="bg-gray-100 rounded px-4 py-1 down">
            <div className="items-center content-center mt-1"> Downlines <span className="count">{following}</span></div>
          </div>
          <button className="text-green-500 rounded border border-0 border-green-500 py-1 px-4">Activated</button>
        </div>
      </AccordionItemPanel>
    </AccordionItem>
  );
};
