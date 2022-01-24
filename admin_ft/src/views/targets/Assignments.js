import React, { useEffect, useState } from 'react';
import { cancelTarget, findAssignments, findTarget } from './api';


const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadAssignments = async () => {
        setIsLoading(true)
        try {
            let response = await findAssignments()
            if (response.status !== "SUCCESS") {
            } else {
                setAssignments(response.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getTarget = (id) => {
        if (!id || id == "") {
            return "cc" + id
        }
        findTarget(id).then(res => {
            return id + res.data.title.toString()
        }).catch((err) => {
            return id + "xx"
        })
    }

    const CancelAssignment = async (ID) => {
        try {
            let response = await cancelTarget(ID)
            if (response.status !== "SUCCESS") {
            } else {
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadAssignments()
        return () => { };
    }, []);

    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                    <tr className="font-bold bg-gray-800 text-gray-100">
                        <th scope="col" className="px-6 py-3 text-left    uppercase   tracking-wider" > Title </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider" >  Reward  </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider" >  amount to be made  </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >  Assigned to   </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >  Is Cancelled  </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >   Runs from   </th>
                        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >  End    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {assignments.map((assignment, index) =>
                        <tr>
                            <td className="p-2">{assignment.target.title}</td>
                            <td className="p-2">{assignment.assignment.reward}</td>
                            <td className="p-2">{assignment.assignment.amount}</td>
                            <td className="p-2">{assignment.assignment.supervisor}</td>
                            <td className="p-2">{assignment.assignment.cancelled ? "Y": "N"}</td>
                            <td className="p-2">{new Date(Number(assignment.assignment.start * 1000)).toLocaleDateString(
                                "en-US"
                            )}</td>
                            <td className="p-2">{new Date(Number(assignment.assignment.deadline * 1000)).toLocaleDateString(
                                "en-US"
                            )}</td>
                            <td onClick={() => { CancelAssignment(assignment.assignment.id) }} className="text-red-800 cursor-pointer text-center">cancel Assignment</td>
                        </tr>
                    )
                    }
                </tbody>
            </table>

        </div>
    );
};


export default Assignments;
