import './index.css'
import { removeAuthToken } from "features/authentication/authSlice";
import { setAuthError } from "features/authentication/authSlice";
import { useDispatch } from "react-redux";
import Wave from '../../assets/img/wave.png'
import { Link } from 'react-router-dom'
import { getAgents } from "../../views/myagents/api";
import { useEffect, useState } from 'react'
import Agent from './agent'

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [agents, setAgents] = useState([]);
    const [filter, setFilter] = useState({ start: 0, to: 0 });
    const [transactions, setTransactions] = useState([]);
    const [query, setQuery] = useState('all');

    const dispatch = useDispatch();

    let getProfile = async () => {
        setIsLoading(true)
        try {
            let response = await getAgents()
            if (response.status != "SUCCESS") {
            } else {
                setAgents(response.data.agents)
            }
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        getProfile()
    }, []);


    return (
        <>
            <div className="px-12 pt-6 pb-5" style={{ backgroundImage: `url(})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: 'rgba(246, 246, 246, 0.97)' }}>
                <div className="flex justify-between pb-3">
                    <div className="my_agents">My Agents</div>
                    <div className="flex gap-3">
                        {/* <Link to="/profile/activate" className="ag-btn border border-0 rounded text-green-500 px-6 py-2 border-green-500 hover:bg-green-500 hover:text-white">Activate account</Link> */}
                        <button className="ag-btn rounded text-white px-6 py-2 bg-red-500" onClick={(e) => {
                            e.preventDefault();
                            dispatch(removeAuthToken());
                            dispatch(setAuthError(""));
                        }}>Sign Out</button>
                    </div>
                </div>

                <p className="ag-h">
                    By default, you are a recruiting supervisor. All paying supervisors would be assigned agents, while recruiting supervisors will need to meet the requirements.
                </p>

                <div className="flex gap-5 py-4">
                    {/* <input placeholder="Search for agent" className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-2/3 md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" />
                    <button className="ag-l btn-primary rounded text-white px-12 py-1">Search</button> */}
                </div>
            </div>

            <div className="absolute top-36 w-5/6">
                <div className="card border border-0 rounded px-6 py-4 text-center bg-white w-1/3">
                    <div className="small-ag">My agents</div>
                    <div className="num">{agents.length}</div>
                </div>

                {/* <div className="mx-auto items-center content-center flex justify-center text-center w-full gap-10 mt-6">
                    <div>
                        <span className="selected--ag">All agents</span>
                        <div className="border--sel"></div>
                    </div>
                    <div>
                        <span className="select--ag">My agents</span>
                    </div>
                    <div>
                        <span className="select--ag">Unassigned agents</span>
                    </div>
                </div> */}

                <div className="grid grid-cols-3 gap-4 px-12 mt-6">
                    {agents.map((a) => <Agent agent={a} />)}
                </div>
            </div>
        </>
    )
}

export default Dashboard;