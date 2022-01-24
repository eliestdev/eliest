import { data } from "autoprefixer";
import { useState } from "react";
import { useEffect } from "react";
import useFetch from "react-fetch-hook";
import { lgaList } from "./lga";
import NaijaStates from "naija-state-local-government";
import { Link } from "react-router-dom";
import { findSupervisors, getSupervisorCount, setSupervisorCount } from "./api";
import { SelectDropDown } from "views/agents/icon";

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
  const [isLoading, setIsLoading] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [superCount, setSuperCount] = useState(0)

  useEffect(() => {
    if (selectedState != "") {
      setLGs([...NaijaStates.lgas(selectedState).lgas]);
    } else {
      setLGs([])
    }
    return () => { };
  }, [selectedState]);

  let loadSupervisors = async () => {
    setIsLoading(true)
    try {
      let response = await findSupervisors()
      if (response.status !== "SUCCESS") {
      } else {
        setSupervisors(response.data)
        await getSupervisorC()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const getSupervisorC = async () => {
    const res = await getSupervisorCount()
    setSuperCount(res.data[0].count)
  }

  useEffect(() => {
    loadSupervisors()
    return () => { };
  }, []);

  const save = async () => {
    setIsLoading(true)
    const res = await setSupervisorCount(superCount)
    setSuperCount(res.data[0].count)
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <h2 className="tracking-tight font-extrabold text-gray-900 text-center bg-gray-100 p-1">
          All Supervisors
        </h2>

        <div className="py-5 px-5">
          <div className="font-semibold">Amount of Agents to assign to paying supervisors</div>
          <div className="py-2 flex justify-between">
            <input onChange={(e) => setSuperCount(e.target.value)} type="number" placeholder="Amount" name="amountAgents" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" value={superCount} />
            <button onClick={save} className="bg-indigo-700 text-white rounded px-3 py-1 hover:text-indigo-700 hover:bg-transparent focus:ring-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800" disabled={isLoading}>{isLoading ? "Please wait..." : "Save Changes"}</button>
          </div>
        </div>

        <div>
          <div class="flex lg:flex-row flex-col items-center py-8 px-4">
            <div class="flex flex-col lg:mr-16">
              <label for="email" class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2" >
                Name or Address
              </label>
              <input id="email" name="content" autocomplete="off" class="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                placeholder="Placeholder"
                onChange={(e) => setFilter({ ...filter, name: e.target.value })}
              />
            </div>

            <div class="flex flex-col lg:mr-16 lg:py-0 py-4">
              <label for="last_email" class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                State
              </label>
              <div className="relative w-full sm:w-1/2 md:w-auto">
                <select
                  onChange={(e) => {
                    setFilter({ ...filter, state: e.target.value });
                    setSelectedState(e.target.value);
                  }}
                  className="focus:outline-none border border-gray-400 rounded-lg appearance-none cursor-pointer text-sm py-3 pl-4 pr-10 text-gray-700"
                >
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

            <div class="flex flex-col lg:mr-16 lg:py-0 py-4">
              <label
                for="last_email"
                class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
              >
                Local Government
              </label>
              <div className="relative w-full sm:w-1/2 md:w-auto">
                <select
                  onChange={(e) =>
                    setFilter({ ...filter, lg: e.target.value })
                  }
                  className="focus:outline-none border border-gray-400 rounded-lg appearance-none cursor-pointer text-sm py-3 pl-4 pr-10 text-gray-700"
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
          <div className="overflow-auto border-b border-gray-200">
            <TableData values={supervisors} filter={filter} />
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
    //070404

    setEntry([...showing]);
    return () => { };
  }, [values, filter]);

  const isBetween = (date, min, max) =>
    date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

  return entry.length > 0 ? (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr className="font-bold bg-gray-800 text-gray-100">
          <th
            scope="col"
            className="px-6 py-3 text-left    uppercase tracking-wider"
          >
            Name
          </th>

          <th
            scope="col"
            className="px-6 py-3 text-left   uppercase tracking-wider"
          >
            Address
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left   uppercase tracking-wider"
          >
            Phone
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left   uppercase tracking-wider"
          >
            State
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left   uppercase tracking-wider"
          >
            LG
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {entry.map((game, index) => (
          <tr key={game.id}>
            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
              <Link to={'/supervisor/' + game.id} href="#" className="text-indigo-600 hover:text-indigo-900">
                {game.firstname} {game.lastname} ({game.refcode})
              </Link>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{game.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {game.phone}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <h6>{game.state}</h6>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <h6>{game.lg}</h6>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <></>
  );
}
