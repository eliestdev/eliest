import { useEffect, useState } from "react";
import AddNew from "./AddNew";
import { deleteAAdmin, getAdmins, updateAAdmin } from "./api";

export default function Example() {
    const [admins, setAdmins] = useState([]);
    const [updateAdmin, setUpdateAdmin] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    let loadAdmins = async () => {
        setIsLoading(true)
        try {
            let response = await getAdmins()
            if (response.status !== "SUCCESS") {
            } else {
                setAdmins([...response.data.admins]);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        loadAdmins()
    }, []);


    let processUpdate = async (id) => {

        if (!updateAdmin.id || updateAdmin.id != id) {
            return
        }

        let copy = { ...updateAdmin}
    
        setIsLoading(true)
        try {
          let response = await updateAAdmin(copy)
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
        const result = admins.find(({ id }) => id === id);

        let copy = { ...result, "status": !result.status }

    
        setIsLoading(true)
        try {
          let response = await deleteAAdmin(copy)
          if (response.status !== "SUCCESS") {
          } else {
            //window.location.reload();
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      };


    return (
        <div className="flex flex-col">
            <AddNew />
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-3 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>

                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >  Name   </th>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >  Email   </th>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >  Phone  </th>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >  Password  </th>
                                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >  Read Only  </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {admins.map((admin) => (
                                    <tr key={admin.email}>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            {admin.name} ({admin.status == true ? "Active" : "Deleted"})
                                        </td>


                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {admin.email}
                                                <input
                                                    type="email"
                                                    placeholder="Update"
                                                    className="shadow mx-2 p-1"
                                                    onChange={(e) => {
                                                        setUpdateAdmin({
                                                            ...updateAdmin, ...admin,
                                                            email: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {admin.phone}
                                                <input
                                                    type="text"
                                                    placeholder="Update"
                                                    className="shadow mx-2 p-1"
                                                    onChange={(e) => {
                                                        setUpdateAdmin({
                                                            ...updateAdmin, ...admin,
                                                            phone: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <input
                                                    type="text"
                                                    placeholder="Update"
                                                    className="shadow mx-2 p-1"
                                                    autocomplete="new-password" onChange={(e) => {
                                                        setUpdateAdmin({
                                                            ...updateAdmin, ...admin,
                                                            password: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {admin.read_only ? "Read Only" : "Read &Write"}
                                                <input
                                                    type="checkbox"
                                                    className="shadow mx-2 p-1"
                                                    defaultChecked={admin.read_only}
                                                    onChange={(e) => {
                                                        setUpdateAdmin({
                                                            ...updateAdmin, ...admin,
                                                            read_only: e.target.checked,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                <button className="bg-gray-700 mx-2 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm" type="submit" onClick={() => processUpdate(admin.id)}  >
                                                    Update
                                                </button>
                                                <button className="bg-red-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-3 text-sm" type="submit" onClick={() => deleteUpdate(admin.id)}  >
                                                    {admin.status ? "Delete" : "Activate"}
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
