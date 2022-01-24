import React, { useEffect, useState } from "react";
import { getAgents } from "./api";
import AllAgents from './allAgents'
import MostFundings from './mostFundings';
import LeastFundings from './leastFunding';
import RecentFundings from './recentFundings';

function Index({ profile }) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState({ start: 0, to: 0 });
  const [transactions, setTransactions] = useState([]);
  const [query, setQuery] = useState('all');

  let getProfile = async () => {
    setIsLoading(true)
    try {
      let response = await getAgents()
      if (response.status != "SUCCESS") {
      } else {
        setAgents(response.data.agents)
      }
    } catch (error) {
      console.log(error)
      setError(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getProfile()
  }, []);

  // console.log(agents);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="">
            <p className="font-medium leading-5 text-gray-800 self-center">
              Assigned agent
            </p>
          </div>

          <div class="flex flex-wrap justify-start mt-2">
            <span onClick={() => setQuery('all')} class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 cursor-pointer">
              <span class="text-xs font-normal leading-none max-w-full flex-initial">All Agents</span>
            </span>
            <span onClick={() => setQuery('most')} class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 cursor-pointer">
              <span class="text-xs font-normal leading-none max-w-full flex-initial">Most Fundings</span>
            </span>

            <span onClick={() => setQuery('least')} class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 cursor-pointer">
              <span class="text-xs font-normal leading-none max-w-full flex-initial">Least Fundings</span>
            </span>

            <span onClick={() => setQuery('recent')} class="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 cursor-pointer">
              <span class="text-xs font-normal leading-none max-w-full flex-initial">Recent Fundings</span>
            </span>
          </div>

          {query === 'all' && <AllAgents agents={agents} loading={isLoading} />}
          {query === 'most' && <MostFundings agents={agents} loading={isLoading} />}
          {query === 'least' && <LeastFundings agents={agents} />}
          {query === 'recent' && <RecentFundings agents={agents} />}

        </div>
      </div>
      <Loading show={isLoading} />
    </div>
  );
}

export default Index;

export const Loading = ({ show, setShow }) => (
  <div className={show != true && "hidden"}>
    <div className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
      <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
        <div className="flex items-center justify-center py-8 px-4">
          <div className="flex md:w-80 rounded shadow-lg p-6 justify-center  dark:bg-gray-800 bg-white">
            <i className="fas fa-circle-notch fa-spin text-8xl text-gray-800"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
);
