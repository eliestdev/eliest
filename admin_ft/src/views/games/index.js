import { useState, useEffect } from "react";
import { games } from "./api";

export default function Index() {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  let loadGames = async () => {
    setIsLoading(true)
    try {
      let response = await games()
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        setData(response.data)
        // window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let updateGame = async () => {
    setIsLoading(true)
    try {
      let response = await games()
      if (response.status !== "SUCCESS") {
        alert(response.message)
      } else {
        setData(response.data)
        // window.location.reload()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    loadGames()
    return () => { };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">

        <h2 className=" text-gray-800   text-lg text-center bg-gray-100">
          Game List
        </h2>

        <div className="align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-auto  border-gray-200 sm:rounded-lg">
            <TableData values={data} />
          </div>
        </div>

      </div>
    </div>
  );
}


function TableData({ values }) {

  const [entry, setEntry] = useState([...values]);
  const [isTinyLoading, setIsTinyLoading] = useState(false);

  useEffect(() => {
    setEntry([...values])
    return () => {

    };
  }, [values]);

  let updateSetting = () => {
    setIsTinyLoading(true)

    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/updategames`, {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(entry),
    })
      .then((response) => {
        setIsTinyLoading(false)
        response.json()
      })
      .then((data) => {
        console.log("Success:", data);
        setIsTinyLoading(false)

      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  let resetCount = (id) => {
    setIsTinyLoading(true)

    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/resetgame/` + id, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsTinyLoading(false)

        response.json()
      })
      .then((data) => {
        setIsTinyLoading(false)
        alert("Game reset complete! set a new target value")
        console.log("Success:", data);
      })
      .catch((error) => {
        alert("Error:" + error)

        console.error("Error:", error);
      });
  };

  return (
    entry.length > 0 ? (
      <div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="font-bold bg-gray-800 text-gray-100">
              <th
                scope="col"
                className="px-6 py-3 text-left   uppercase tracking-wider"
              >
                Game Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left   uppercase tracking-wider"
              >
                Price (Naira)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left   uppercase tracking-wider"
              >
                Winning Count
              </th>
               <th
                scope="col"
                className="px-6 py-3 text-left   uppercase tracking-wider"
              >
                Winning Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left    uppercase tracking-wider"
              >
                Winner's Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center    uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>

              {isTinyLoading && <i class="fas fa-spinner fa-pulse"></i>}

            </tr>

            {entry.map((game, index) => (
              <tr key={game.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900"> ID: {game.id}</div>
                  <input
                    className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    value={game.test}
                    name="test"
                    onChange={(e) => {
                      let copyEntry = [...entry]
                      let target = copyEntry[index]
                      target[e.target.name] = e.target.value
                      setEntry(copyEntry)
                    }
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {game.cost}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    value={game.count}
                    name="count"
                    onChange={(e) => {
                      let copyEntry = [...entry]
                      let target = copyEntry[index]
                      target[e.target.name] = Number(e.target.value)
                      setEntry(copyEntry)

                    }
                    }
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    value={game.winningAmount}
                    name="winningAmount"
                    onChange={(e) => {
                      let copyEntry = [...entry]
                      let target = copyEntry[index]
                      target[e.target.name] = Number(e.target.value)
                      setEntry(copyEntry)

                    }
                    }
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
                    value={game.cut}
                    name="cut"
                    onChange={(e) => {
                      let copyEntry = [...entry]
                      let target = copyEntry[index]
                      target[e.target.name] = Number(e.target.value)
                      setEntry(copyEntry)

                    }
                    }
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => {
                      updateSetting()
                    }}
                    className="border-gray-100 shadow px-3 py-2"
                    style={{ margin: 6 }}

                  >
                    Save Changes
                  </a>

                  <a
                    href="#"
                    className="text-gray-100  btn bg-red-500 p-2"
                    onClick={() => {
                      resetCount(game.id)
                    }}
                    style={{ margin: 6 }}
                  >
                    Reset Games
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (<></>)

  )
}