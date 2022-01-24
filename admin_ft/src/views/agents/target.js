import { getGlobalTarget, addGlobalTarget } from './api'
import { useEffect, useState } from 'react'

const AgentTargets = () => {
    const [minimum, setMinimum] = useState(0)
    const [reward, setReward] = useState(0)

    useEffect(async () => {
        const res = await getGlobalTarget();
     
        if (res.data.length > 0) {
            setMinimum(res.data[0].minimum)
            setReward(res.data[0].reward)
        }

    }, [])

    const save = async () => {
        const res = await addGlobalTarget(minimum, reward)
        console.log(res)
    }

    const changeMinimum = (e) => {
        setMinimum(Number(e.target.value))
    }

    const changeReward = (e) => {
        setReward(Number(e.target.value))
    }

    return (
        <>
            <div className="font-semibold text-2xl">
                Agent Targets
            </div>

            <div className="grid grid-cols-3 gap-5 py-6">
                <div className="grid">
                    <label htmlFor="minimum">
                        Minimum
                    </label>

                    <input value={minimum} onChange={changeMinimum} type="number" placeholder="Minimum no. of agents" name="minimum" id="minimum" className="mt-5 border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="grid">
                    <label htmlFor="reward">
                        Reward
                    </label>

                    <input value={reward} onChange={changeReward} type="number" placeholder="Reward" name="reward" id="reward" className="mt-5 border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="grid">
                    <button className="text-indigo-600" onClick={save}>Save</button>
                </div>
            </div>
        </>
    )
}

export default AgentTargets;