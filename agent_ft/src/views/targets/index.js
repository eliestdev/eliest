import { showSeeTargets } from 'features/utils/utilSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyTarget, deleteTarget } from './api';
import TargetDetail from 'components/dialog/target_detail';

const Index = () => {

    const [targets, setTargets] = useState([]);
    const [selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    let seeTarget = useSelector((state) => state.utility.seeTarget);

    const dispatch = useDispatch()

    const deleteTarg = async (tar) => {
        const res = await deleteTarget(tar.ID)
        if(res.status === "SUCCESS") {
            window.location.reload()
        } else {
            alert('Failed to delete Target')
        }
    }

    const setShowTarget = () => {
        dispatch(showSeeTargets(!seeTarget))
    }

    const loadTargets = async () => {
        setIsLoading(true)
        try {
            let response = await getMyTarget()
            if (response.status == "SUCCESS")
                setTargets(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadTargets()
        return () => { };
    }, []);

    return (
        <div className="flex justify-center my-5">

            <table className="md:w-2/3 w-full">
                <thead>
                    <tr className="bg-gray-100 font-bold">
                        <td className="p-3">Goal Description</td>
                        <td>Start Day</td>
                        <td>End Day</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {targets.map(target =>
                        <tr className="border-b-2">
                            <td><p className="p-5 text-sm">
                                Refer and activate <p>{target.downline} new agents to earn N{Math.round(target.reward)}</p>
                            </p></td>
                            <td>{new Date(target.created_at * 1000).toLocaleDateString()}  </td>
                            <td>{new Date(target.timeline * 1000).toLocaleDateString()}  </td>
                            <td> <button className="p-2 rounded-lg text-green-500" onClick={() => { setSelected(target); dispatch(showSeeTargets(true)) }}>View Progress</button></td>
                            <td> <button className="bg-red-600 p-2 rounded-lg text-white" onClick={() => deleteTarg(target)}>Delete</button></td>
                        </tr>)}
                </tbody>
            </table>

            {selected && <TargetDetail open={seeTarget} setOpen={setShowTarget} target={selected} />}
        </div>
    );
};

export default Index;
