import { useEffect } from "react";
import { useState } from "react";
import { getValues, updateValues } from "./api";


export default function Example() {
  const [values, setValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTinyLoading, setIsTinyLoading] = useState(false);

  let loadParams = async () => {
    setIsLoading(true)
    try {
      let response = await getValues()
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        setValues(response.data)
        // window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadParams()
    return () => { };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">

        <h2 className=" text-gray-800   text-lg text-center bg-gray-100">
          Values
        </h2>


        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >  Title  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >  Values </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" > Actions  </th>
                </tr>
              </thead>
              <TableBody {...values} />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableBody(values) {
  const [entry, setEntry] = useState({ ...values });
  const [isTinyLoading, setIsTinyLoading] = useState(false);

  useEffect(() => {
    setEntry({ ...values });
    return () => { };
  }, [values]);

  let updateValue = async () => {
    setIsTinyLoading(true)
    try {
      let response = await updateValues(entry)
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        //setValues(response.data)
        // window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsTinyLoading(false)
    }
  };

  // ActivationFee 101
  // ActivationReturn 102
  // VoucherDiscount 103
  // VoucherLength 104
  // WinningLength
  // ReferralPercentage1 001
  // ReferralPercentage2 002
  // SupervisorAgentLimit 202

  return entry["101"] ? (
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>

        {isTinyLoading && <i class="fas fa-spinner fa-pulse"></i>}

      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Activation Fee
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            name="101"
            value={entry["101"]}
            onChange={(e) => {
              setEntry({ ...entry, "101": Number(e.target.value) });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Supervisor Activation Fee
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            name="201"
            value={entry["201"]}
            onChange={(e) => {
              setEntry({ ...entry, "201": Number(e.target.value) });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Activation Voucher Return
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            name="102"
            value={entry["102"]}
            onChange={(e) => {
              setEntry({
                ...entry,
                "102": Number(e.target.value),
              });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Voucher Discount
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["103"]}
            onChange={(e) => {
              setEntry({ ...entry, "103": Number(e.target.value) });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Voucher Length
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["104"]}
            onChange={(e) => {
              setEntry({ ...entry, "104": Number(e.target.value) });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Winning Length
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["105"]}
            onChange={(e) => {
              setEntry({ ...entry, "105": Number(e.target.value) });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Referral Percentage 1
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["001"]}
            onChange={(e) => {
              setEntry({
                ...entry,
                "001": e.target.value,
              });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>

      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Referral Percentage 2
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["002"]}
            onChange={(e) => {
              setEntry({
                ...entry,
                "002": e.target.value,
              });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>


      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Supervisor Agent Limit
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["202"]}
            onChange={(e) => {
              setEntry({
                ...entry,
                "202": Number(e.target.value),
              });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>

      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          Tax in Percentage
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <input
            className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
            value={entry["302"]}
            onChange={(e) => {
              setEntry({
                ...entry,
                "302": Number(e.target.value),
              });
            }}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a
            href="#"
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => updateValue()}
            className="border-gray-100 shadow px-3 py-2 cursor-pointer"
            style={{ margin: 6 }}
          >
            Save Changes
          </a>
        </td>
      </tr>

    </tbody>
  ) : (
    <></>
  );
}
