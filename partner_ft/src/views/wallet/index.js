import { data } from "autoprefixer";
import { useState } from "react";
import { useEffect } from "react";

export default function Index() {
  const [balance, setBalance] = useState(0)
  const [value, setValues] = useState([])
  const [filter, setFilter] = useState({
    content: "",
    type: "",
    ref: "",
    start: 962641361,
    end: Date.now(),
  });
  const profile = JSON.parse(localStorage.getItem("token"))


  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/wallet?account=${profile.walletId}`)
      .then((response) => response.json())
      .then((data) => {
        setValues([...data.data.transactions]);
      });
  }, []);

  useEffect(() => {
    evaluateBalance()
  }, [value]);

  let evaluateBalance = () => {
    let total = 0
    value.forEach(v => {
      total += v["amount"]
    });
    setBalance(total)
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <h2 className="text-center tracking-tight font-extrabold text-gray-900 p-1 bg-gray-100">
          Conde - Default Wallet
        </h2>



        <div>
          <div class="flex lg:flex-row flex-col items-center py-8 px-4">
            <div class="flex flex-col lg:mr-16">
              <label  for="email"  class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                Description and Transaction Ref
              </label>
              <input
                id="email" name="content"
                autocomplete="off"
                class="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                placeholder="Placeholder"
                onChange={(e) =>
                  setFilter({ ...filter, content: e.target.value })
                }
              />
            </div>

            <div class="flex flex-col lg:py-0 py-4">
              <label for="email1"   class="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"> Start Date </label>
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
              <label for="email1"
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

        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <h4>Actions</h4>
          <div className="mt-6 lg:mt-0">
            <button className="transition duration-150 ease-in-out  focus:outline-none border bg-gray-700 rounded text-white px-8 py-2 text-sm">
              Available balance: {balance}
            </button>
            <button className="transition duration-150 ease-in-out  focus:outline-none border bg-blue-700 rounded text-white px-8 py-2 text-sm">
              Withdraw to BANK
            </button>
          </div>
        </div>
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
            <TableData values={value} filter={filter} />
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
        (entry.description.includes(filter.content) || entry.reference.includes(filter.content)) &&

        isBetween(
          new Date(entry.created_at * 1000),
          new Date(filter.start),
          new Date(filter.end)
        )
      );
    });

    setEntry([...showing]);
    return () => { };
  }, [values, filter]);

  const isBetween = (date, min, max) =>
    date.getTime() >= min.getTime() && date.getTime() <= max.getTime();

  return (<table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr className="font-bold bg-gray-800 text-gray-100">
        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"  >  Date</th>
        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider">  Amount </th>
        <th scope="col" className="px-6 py-3 text-left   uppercase tracking-wider" >  Transaction Reference </th>
        <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider" >  Description </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {entry.map((game, index) => (
        <tr key={game.id}>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="#" className="text-indigo-600 hover:text-indigo-900">
              {new Date(Number(game.created_at * 1000)).toLocaleDateString("en-US")}
            </a>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> {game.amount}  </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">  <h6>{game.reference}</h6>  </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> <h6>{game.description}</h6>  </td>
        </tr>
      ))}
    </tbody>
  </table>)

}
