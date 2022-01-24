import { useHistory } from 'react-router-dom'
import User from '../../assets/svg/User.svg'
import More from '../../assets/svg/More.svg'
import { useEffect, useState } from 'react'
import { getAgentDownline } from './api'
import { useSelector } from 'react-redux'
import { selectToken } from 'features/authentication/authSlice'

const Agent = ({ agent }) => {
    const history = useHistory();
    const token = useSelector(selectToken)
    const [downline, setDownline] = useState([])

    useEffect(async () => {
        const res = await getAgentDownline(agent.refcode)
        setDownline(res.data.direct)
    }, [])

    return (
        <div className="rounded border border-0 bg-white py-4 px-6" onClick={() => history.push(`/my-agents/${agent.id}`)}>
            <div className="flex justify-between items-center gap-3">
                <img src={User} />

                <div>
                    <span className="nam">{agent.firstname} {" "}  {agent.lastname}</span>
                    <p className="ap">
                        {agent.status}
                    </p>
                </div>

                <img src={More} />
            </div>

            <div className="pt-6 flex justify-between gap-4">
                <div className="bg-gray-400 px-4 py-1 rounded text-white">
                    Downlines: {downline.length}
                </div>

                <div className="bg-green-100 px-4 py-1 rounded text-green-800">
                    Satisfactory
                </div>
            </div>
        </div>
    );
}

export default Agent;