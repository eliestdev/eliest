import React from 'react'
import Balance from './balance';
import { Link } from "react-router-dom";

const AllAgents = ({ agents, loading }) => {
    return (
        <div>
            {loading && <div className="flex text-center">
                Loading... Please wait
            </div>}
            {agents.map((agent, index) => (
                <div className="flex items-center justify-between flex-wrap  shadow my-5 p-1">
                    <div className="w-0 flex-1 flex items-center">
                        <p className="ml-3 font-medium truncate">
                            <span className="">
                                <Balance agent={agent} />

                                {agent.firstname} {agent.lastname}
                            </span>
                            <p className="font-thin text-sm">{agent.phone}</p>
                        </p>
                    </div>

                    <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                        <p className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50">
                        </p>
                    </div>

                    <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                        <Link to={"my-agents/" + agent.id} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50" >Details  </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AllAgents;