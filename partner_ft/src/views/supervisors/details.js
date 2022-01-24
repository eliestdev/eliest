import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { findSupervisor, suspendSupervisor, unsuspendSupervisor } from "./api";

export default function Index(props) {

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [supervisor, setSupervisor] = useState({ profile: {}, agents: [] });

  let loadSupervisor = async () => {
    setIsLoading(true)
    try {
      let response = await findSupervisor(id)
      if (response.status != "SUCCESS") {
      } else {
        setSupervisor(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };


  useEffect(() => {
    loadSupervisor()
    return () => { };
  }, []);


  let suspendAct = async () => {
    setIsLoading(true)
    try {
      let response = await suspendSupervisor(id)
      if (response.status != "SUCCESS") {
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let unsuspendAct = async () => {
    setIsLoading(true)
    try {
      let response = await unsuspendSupervisor(id)
      if (response.status != "SUCCESS") {
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <h2 className="text-center tracking-tight font-extrabold text-gray-900 p-1 bg-gray-100">
          Supervisor Profile
        </h2>

        <table>
          <tbody>
            <tr>
              <td className="border font-semibold p-1">Firstname</td>
              <td className="border p-1">{supervisor.profile.firstname}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Lastname</td>
              <td className="border p-1">{supervisor.profile.lastname}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Location</td>
              <td className="border p-1">   {supervisor.profile.address} --- {supervisor.profile.state} ---{" "}
                {supervisor.profile.lg}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Firstname</td>
              <td className="border p-1">{supervisor.profile.refcode}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Active Since</td>
              <td className="border p-1">{new Date(supervisor.profile.created_at * 1000).toString()}</td>
            </tr>
            <tr>
              <td className="border font-semibold p-1">Status</td>
              <td className="border p-1">Account is {supervisor.profile.suspended ? "suspended" : "open"}</td>
            </tr>
          </tbody>
        </table>

        <div className="align-middle inline-block min-w-full mt-2 bg-gray-100 p-2">
          <p>Actions</p>

          <div className="space-x-2">
          {supervisor.profile.suspended ? <button onClick={() => unsuspendAct()} className="rounded text-gray-100 px-8 py-2 text-sm bg-gray-800">
                Open Account
              </button> : <button onClick={() => suspendAct()} className="rounded text-gray-100 px-8 py-2 text-sm bg-gray-900">
                Suspend Account
              </button>}
          </div>
        </div>

        <div className="align-middle inline-block min-w-full mt-5">
          <h3 className=" bg-gray-100 p-2 rounded mb-2">Assigned Agents ({supervisor.agents.length})</h3>
        </div>
        {
          supervisor.agents.map(agent =>
            <div className="flex justify-between text-xs">
              <p>{agent.id}</p>
              <p>{agent.firstname}</p>
              <p>{agent.lastname}</p>
              <p>{agent.phone}</p>
              <p>{agent.state}</p>
              <p>{agent.lg}</p>
            </div>
          )
        }
      </div>
    </div>
  );
}