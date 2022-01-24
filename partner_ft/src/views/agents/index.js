import { useState } from "react";
import { useEffect } from "react";
import NaijaStates from "naija-state-local-government";
import { Link } from "react-router-dom";
import { findAgents } from "./api";
import { SelectDropDown } from "./icon";

export default function Index() {
  const [filter, setFilter] = useState({
    name: "",
    ref_code: "",
    email: "",
    state: "",
    lg: "",
  });

  const ngStates = NaijaStates.states();
  const [selectedState, setSelectedState] = useState("");
  const [lgs, setLGs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  let loadAgents = async () => {
    setIsLoading(true)
    try {
      let response = await findAgents()
      if (response.status !== "SUCCESS") {
      } else {
        setAgents(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadAgents()
    return () => { };
  }, []);

  useEffect(() => {
    if (selectedState != "") {
      setLGs([...NaijaStates.lgas(selectedState).lgas]);
    } else {
      setLGs([])
    }
    return () => { };
  }, [selectedState]);


  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto mx-5">
        <h2 className="text-lg tracking-tight font-extrabold text-gray-900 ">  All Agents </h2>
        <div>
          <div class="flex lg:flex-row flex-col items-center">
            <div class="flex flex-col lg:mr-10">
              <label for="email" class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2" >
                Name or Address
              </label>
              <input name="content" autocomplete="off"
                class="text-gray-600  bg-white  h-10  pl-3 text-sm border-gray-300 rounded border"
                onChange={(e) =>
                  setFilter({ ...filter, name: e.target.value })
                }
              />
            </div>

            <div class="flex flex-col lg:mr-16 lg:py-0 py-4">
              <label class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2" >
                State
              </label>
              <div className="relative w-full sm:w-1/2 md:w-auto">
                <select
                  onChange={(e) => {
                    setFilter({ ...filter, state: e.target.value });
                    setSelectedState(e.target.value);
                  }}
                  className="focus:outline-none border border-gray-400 rounded-lg appearance-none cursor-pointer text-sm py-2 pl-4 pr-10 text-gray-700"  >
                  <option value="" defaultValue>
                    All States
                  </option>
                  {ngStates.map((state) => (
                    <option value={state}>{state}</option>
                  ))}
                </select>
                <div className="w-4 h-4 absolute m-auto inset-0 mr-4 pointer-events-none cursor-pointer">
                  <SelectDropDown />
                </div>
              </div>
            </div>

            <div class="flex flex-col lg:mr-16 lg:py-0 py-2">
              <label for="last_email" class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"  >   Local Government  </label>
              <div className="relative w-full sm:w-1/2 md:w-auto">
                <select
                  onChange={(e) =>
                    setFilter({ ...filter, lg: e.target.value })
                  } className="focus:outline-none border border-gray-400 rounded-lg appearance-none cursor-pointer text-sm py-3 pl-4  pr-10 text-gray-700"
                >
                  <option value="" defaultValue>
                    All LGs
                  </option>
                  {lgs.map((lg) => (
                    <option value={lg}>{lg}</option>
                  ))}
                </select>
                <div className="w-4 h-4 absolute m-auto inset-0 mr-4 pointer-events-none cursor-pointer">
                  <SelectDropDown />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-2 align-middle inline-block min-w-full">
          <div className="shadow overflow-auto border-b border-gray-200 my-4">
            <TableData values={agents} filter={filter} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TableData({ values, filter }) {
  const [entry, setEntry] = useState([...values]);

  useEffect(() => {
    const showing = values.filter(function (entry) {
      return (
        (entry.firstname.toLowerCase().includes(filter.name.toLowerCase()) || entry.lastname.toLowerCase().includes(filter.name.toLowerCase()) ||
          entry.phone.toLowerCase().includes(filter.name.toLowerCase()) ||
          entry.address.toLowerCase().includes(filter.name.toLowerCase()) ||
          entry.refcode.toLowerCase().includes(filter.name.toLowerCase())) &&
        entry.state.toLowerCase().includes(filter.state.toLowerCase()) &&
        entry.lg.toLowerCase().includes(filter.lg.toLowerCase())
      );
    });
    setEntry([...showing]);
    return () => { };
  }, [values, filter]);

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr className="font-bold bg-gray-800 text-gray-100">
          <th scope="col" className="px-6 py-3 text-left    uppercase   tracking-wider" > Name </th>
          <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider" >   Address   </th>
          <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >  Phone   </th>
          <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >   State  </th>
          <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider"  >   LG  </th>
          
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {entry.map((agent, index) => (
          <tr key={agent.id}>
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
              <Link to={'/agent/' + agent.id} href="#" className="text-indigo-600 hover:text-indigo-900">
                {agent.firstname} {agent.lastname} ({agent.refcode})
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{agent.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {agent.phone}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <h6>{agent.state}</h6>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <h6>{agent.lg}</h6>
            </td>
            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <Link className="px-6 py-1 bg-black text-white rounded hover:text-black hover:bg-transparent" to={`/admin/agents/target/${agent.id}`}>Set Reward</Link>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>)
}
