import { useEffect, useState } from "react";
import { addPartner, deleteAPartner, getPartners, updateAPartner } from "./api";

export default function Example() {
  const [people, setPeople] = useState([]);
  const [newPartner, setNewPartner] = useState({ status: true });
  const [updatePartner, setUpdatePartner] = useState({ "status": true });
  const [isLoading, setIsLoading] = useState(false);

  let loadPartners = async () => {
    setIsLoading(true)
    try {
      let response = await getPartners()
      if (response.status !== "SUCCESS") {
      } else {
        setPeople(response.data.partner)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadPartners()
  }, []);

  let AddPerson = async () => {
    setIsLoading(true)
    try {
      let response = await addPartner(newPartner)
      if (response.status !== "SUCCESS") {
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let processUpdate = async (id) => {
    let copy = { ...updatePartner, id: id}

    setIsLoading(true)
    try {
      let response = await updateAPartner(copy)
      if (response.status !== "SUCCESS") {
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let deleteUpdate = async (id) => {
    let copy = { ...updatePartner, id: id, "status": false }

    setIsLoading(true)
    try {
      let response = await deleteAPartner(copy)
      if (response.status !== "SUCCESS") {
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };


  return (
    <div className="flex flex-col">
   
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >  ID </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >  Name   </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >  Percentage  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >  Action  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium text-gray-900">
                            {person.id} {person.status == true ? "Active" : "Deleted"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium text-gray-900">
                            {person.percentage}
                            <input
                              type="number"
                              placeholder="Update"
                              className="shadow mx-3 p-2"
                              onChange={(e) => {
                                setUpdatePartner({
                                  ...updatePartner,
                                  percentage: Number(e.target.value),
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <button className="bg-gray-700 mx-2 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm" type="submit" onClick={() => processUpdate(person.id)}  >
                          Update
                        </button>
                        <button className="bg-red-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm" type="submit" onClick={() => deleteUpdate(person.id)}  >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
