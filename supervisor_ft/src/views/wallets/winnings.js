import { selectToken } from "features/authentication/authSlice";
import { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useSelector } from "react-redux";



function WalletWinnings({profile}) {
    const token = useSelector(selectToken);
    const [filter, setFilter] = useState({
      content: "",
      type: "",
      ref: "",
      start: 962641361,
      end: Date.now(),
    });

    const { isLoading, data, error } = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w2${profile.id}`, {
        headers:{
            "Authorization": "Bearer " + JSON.parse(token).access_token
        }
    });
    return (
      <>
         <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
         <div className="flex justify-center align-middle sm:px-6 lg:px-8 mx-auto">
          <div class="flex lg:flex-row flex-col items-center py-8 px-4">
            <div class="flex flex-col lg:mr-16">
              <label
                for="email"
                class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
              >
                Description and Transaction Ref
              </label>
              <input
                id="email"
                name="content"
                autocomplete="off"
                class="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                placeholder="Placeholder"
                onChange={(e) =>
                  setFilter({ ...filter, content: e.target.value })
                }
              />
            </div>

            <div class="flex flex-col lg:py-0 py-4">
              <label
                for="email1"
                class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                onChange={(e) => {
                  let starting = 962641361;
                  if (e.target.value) {
                    starting = new Date(e.target.value).setHours(0, 0, 0, 1);
                  }
                  setFilter({
                    ...filter,
                    start: starting,
                  });
                }}
                id="email1"
                class="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                placeholder="example@example.com"
              />
            </div>
            <div class="flex flex-col lg:py-0 py-4">
              <label
                for="email1"
                class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                onChange={(e) => {
                  let ending = Date.now();
                  if (e.target.value) {
                    ending = new Date(e.target.value).setHours(23, 59, 59, 999);
                  }
                  setFilter({ ...filter, end: ending });
                }}
                id="email1"
                class="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                placeholder="example@example.com"
              />
            </div>
          </div>
        </div>
          <div class="flex justify-center py-2 align-middle sm:px-6 lg:px-8 mx-auto">
            <div class=" shadow overflow-hidden border-b border-gray-200  mx-auto">
              <table class="w-2/3 lg:w-1/2 divide-y divide-gray-200 mx-auto">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title{" "}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount{" "}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reference{" "}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type{" "}
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date{" "}
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                {data && data.transactions && (
                  <TransactionData values={data.transactions} filter={filter} />
                )}
            
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
  


function TransactionData({ values, filter }) {
  const [entry, setEntry] = useState([...values]);

  useEffect(() => {
    const showing = values.filter(function (entry) {
      return (
        (entry.description.toLowerCase().includes(filter.content.toLowerCase()) ||
          entry.t_ref.toLowerCase().includes(filter.content.toLowerCase()))  &&
        isBetween(
          new Date(entry.created_at * 1000),
          new Date(filter.start),
          new Date(filter.end)
        )
      );
    });
    setEntry([...showing]);
    return () => {};
  }, [values, filter]);

  const isBetween = (date, min, max) =>
    date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

  return (
    <>
      {entry.map((item) => (
        <TransactionItem
          title={item.description}
          channel={item.channel}
          date={new Date(item.created_at * 1000).toLocaleString("en-US")}
          amount={item.amount}
          type={item.class}
          tref={item.t_ref}
        />
      ))}
    </>
  );
}

  function TransactionItem({ title, channel, amount, type, date, tref }) {
    return (
      <>
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="flex-shrink-0 flex h-10 w-10 center flex-center justify-center align-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 center self-center"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>{" "}
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">{title} </div>
                <div class="text-sm text-gray-500">with {channel} </div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{amount}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{tref}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {type}{" "}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {date}{" "}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="#" class="text-indigo-600 hover:text-indigo-900">
              Details
            </a>
          </td>
        </tr>
      </>
    );
  }
  

  export default WalletWinnings;
