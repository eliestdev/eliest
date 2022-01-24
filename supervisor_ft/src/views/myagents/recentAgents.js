import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NumberFormat from 'react-number-format';

const RecentAgent = (agents, transaction) => {
    const [agent, setAgent] = useState({});
    const trans = agents.transaction
       
    const checkAgent = () => {
        const ag = agents.agents;
        const res = ag.find(e => e.id === trans.source);
        setAgent(res);
    }

    useEffect(() => checkAgent(), [])

    const generateDate = (timestamp) => {
        let d = new Date(timestamp * 1000);
        return d.toLocaleDateString("en-US");
    };

    return (
        <div>
            {agent && <div className="flex items-center justify-between flex-wrap  shadow my-5 p-1">
                <div className="w-0 flex-1 flex items-center">
                    <p className="ml-3 font-medium truncate">
                        <span className="">
                            {agent.firstname} {agent.lastname} recently funded <NumberFormat thousandSeparator={true} prefix={'N'} displayType={'text'} value={trans.amount}/> at {generateDate(trans.created_at)}
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
            }
        </div>
    );
}

export default RecentAgent;