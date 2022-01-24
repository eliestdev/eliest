import { useState } from "react";
import { useEffect } from "react";
import AddNew from "./AddNew";
import { createAssignment, findTargets } from "./api";

export default function Index() {
  const [targets, setTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let loadTargets = async () => {
    setIsLoading(true)
    try {
      let response = await findTargets()
      if (response.status !== "SUCCESS") {
      } else {
        setTargets(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadTargets()
    return () => { };
  }, []);


  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <h2 className="tracking-tight font-extrabold text-gray-900 p-1 bg-gray-100 text-center">
          Target Lists
        </h2>
        <AddNew />
        <div className="align-middle inline-block min-w-full">
          <div className="overflow-auto border-b border-gray-200">
            <TableData values={targets} />
          </div>
        </div>
      </div>
    </div>
  );
}


function TableData({ values }) {

  const [entry, setEntry] = useState([...values]);
  const [assignModal, setAssignModal] = useState(false);
  const [chosenId, setChosenId] = useState("");
  const [chosenAmount, setChosenAmount] = useState(0);
  useEffect(() => {
    setEntry([...values])
    return () => { };
  }, [values]);

  return (

    <div>
      <table className="min-w-full divide-y divide-gray-200 mx-5 text-xs">
        <thead className="bg-gray-50">
          <tr className="font-bold bg-gray-800 text-gray-100">
            <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider" > Title  </th>
            <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider">Description  </th>
            <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider" >Target </th>
            <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Action</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {entry.map((target, index) => (
            <tr key={target.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs      bg-green-100 text-green-800">  {target.title}  </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5     bg-green-100 text-green-800">  {target.description} </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold   bg-green-100 text-green-800">  {target.spendingTarget}   </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onClick={() => { setChosenAmount(Number(target.spendingTarget)); setAssignModal(!assignModal); setChosenId(target.id) }} className="self-center  transition duration-150 ease-in-out rounded text-gray-800 px-8 py-2 text-sm" type="submit">
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(chosenId != "" && chosenAmount != 0) && <AssignModal modal={assignModal} showModal={setAssignModal} targetId={chosenId} amount={chosenAmount}/>
      }
    </div>
  )
}

const AssignModal = ({ modal, showModal, targetId, amount}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [newAssign, setNewAssign] = useState({
    supervisor: "all", target: targetId, amount: amount
  });


  let createTarget = async () => {
    setIsLoading(true)
    try {
      let response = await createAssignment(newAssign)
      if (response.status !== "SUCCESS") {
      } else {
        alert("Success:");
        console.log("Success:");
      }
    } catch (error) {
      alert("Error");
      console.error("Error:", error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    return () => {
    };
  }, [newAssign]);

  return (
    <div>
      {modal && (
        <div className="py-12 bg-gray-700  transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">

          <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
            <div className="relative p-4 md:p-8 bg-white   shadow-md rounded border border-gray-400 ">
              <h1 className="text-center text-gray-800 font-lg font-bold tracking-normal leading-tight mb-4">Assign Target</h1>

              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Rewards: How much would be earned if target meet
              </label>
              <input
                type="number"  name="reward"  id="reward"
                placeholder="Reward"
                onChange={(e) => { setNewAssign({ ...newAssign, "reward": Number(e.target.value) }) }}
                className="w-full border border-gray-300   pl-3 py-3 shadow-sm rounded text-sm   bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
              />


              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"   name="start"   id="start"  placeholder="start"
                onChange={(e) => { setNewAssign({ ...newAssign, "start": new Date(e.target.value).getTime() / 1000 }) }}
                className="w-full border border-gray-300  pl-3 py-3 shadow-sm rounded text-sm focus:outline-none  bg-transparent placeholder-gray-500 text-gray-500 "
              />


              <label htmlFor="city" className="block text-sm font-medium text-gray-700 ">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                placeholder="start"
                onChange={(e) => { setNewAssign({ ...newAssign, "deadline": new Date(e.target.value).getTime() / 1000 }) }}
                className="w-full border border-gray-300  pl-3 py-3 shadow-sm rounded text-sm focus:outline-none  bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
              />

              <button onClick={() => { setNewAssign({ ...newAssign, "agent": "all" }); createTarget() }} className="mt-2 bg-gray-800   transition duration-150 text-gray-100  ease-in-out  border rounded px-8 py-2 text-sm" onclick={() => showModal(!modal)}>
                Assign to all supervisor
              </button>

              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mt-10">
                To assign only to a specific Supervisor: Enter supervisor phone number
              </label>
              <input  type="text"   placeholder="start" onChange={(e) => { setNewAssign({ ...newAssign, "supervisor": e.target.value }); }} className="w-full border border-gray-300   pl-3 py-3 shadow-sm rounded text-sm     bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />

              <button onClick={() => { createTarget() }} className="  mt-2 bg-blue-100      hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm" onclick={() => showModal(!modal)}>
                Assign to Agent
              </button>

              <button onClick={() => { showModal(!modal) }} className="focus:outline-none ml-3 bg-gray-100  border rounded px-8 py-2 text-sm" onclick={() => showModal(!modal)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
