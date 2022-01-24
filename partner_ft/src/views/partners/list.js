import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



export default function Example() {
  const [people, setPeople] = useState([]);
  const [date, setDate] = useState(1);

  const [vouchers, setVouchers] = useState([]);
  const [totalVouchers, setTotalVouchers] = useState(0);

  const [funding, setFunding] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);

  const [winnings, setWinnings] = useState([]);
  const [totalWinnings, setTotalWinnings] = useState(0);

  const [games, setGames] = useState([]);
  const [totalGames, setTotalGames] = useState(0);

  const [tax, setTax] = useState(10);
  const [margin, setMargin] = useState(0);
  const [profit, setProfit] = useState(0);

 useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/partnerlist`)
      .then((response) => response.json())
      .then((data) => {
        setPeople([...data.partner]);
      });
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/finance?t=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setVouchers([...data.vouchers]);
        setFunding([...data.payments]);
        setWinnings([...data.winnings]);
      });
  }, [date]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_ENDPOINT_URL}v1/gameentry?t=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setGames([...data]);
      });
  }, [date]);

  let evaluateTotalVoucher = () => {
    let total = 0;
    vouchers.forEach((voucher) => {
      total += voucher["amount"];
    });
    return total;
  };

  let evaluateTotalFunding = () => {
    let total = 0;
    funding.forEach((fund) => {
      total += fund["amount"];
    });
    return total;
  };

  let evaluateTotalWinnings = () => {
    let total = 0;
    winnings.forEach((wins) => {
      total += wins["amount"];
    });
    return total;
  };

  let evaluateTotalGames = () => {
    let total = 0;
    games.forEach((game) => {
      total += game["amount"];
    });
    return total;
  };

  let taxAmount = (total, tax) => {
    return (total * tax) / 100;
  };

  useEffect(() => {
    let total = evaluateTotalVoucher();
    setTotalVouchers(total);
  }, [vouchers, funding, winnings]);

  useEffect(() => {
    let total = evaluateTotalFunding();
    setTotalFunding(total);
  }, [vouchers, funding, winnings]);

  useEffect(() => {
    let total = evaluateTotalWinnings();
    setTotalWinnings(total);
  }, [vouchers, funding, winnings]);

  useEffect(() => {
    let total = evaluateTotalGames();
    setTotalGames(total);
  }, [games]);
  //
  useEffect(() => {
    let margin = ((totalGames + totalVouchers) - totalWinnings)
    setMargin(margin);
  }, [date, totalGames, totalVouchers, totalWinnings]);

  useEffect(() => {
    let profit = (margin - taxAmount(totalGames + totalVouchers, tax)).toFixed(
      2
    );
    setProfit(profit);
  }, [margin, totalGames, totalVouchers]);

  return (
    <div className="flex flex-col">
         <div className="container mx-auto   h-full mb-5">
        <div className="bg-white dark:bg-gray-800 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-10 shadow rounded-t">
          <div className="flex items-center mb-4 sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
            <div className="ml-2">
              <Link to="/admin/partnerlist" className="text-gray-800 dark:text-gray-100 text-sm font-bold">
                Show List
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto   h-full mb-5">
        <div className="bg-white dark:bg-gray-800 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 sm:px-10 shadow rounded-t">
          <div className="flex items-center mb-4 sm:mb-0 md:mb-0 lg:mb-0 xl:mb-0">
            <div className="ml-2">
              <h2 className="text-gray-800 dark:text-gray-100 text-sm font-bold">
                Choose Month
              </h2>
            </div>
          </div>
          <div>
            <div className="relative w-full sm:w-1/2 md:w-auto">
              <select
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                className="focus:outline-none border border-gray-400 rounded-lg appearance-none cursor-pointer text-sm py-3 pl-4 pr-10 text-gray-700"
              >
                <option value="1">June 2021</option>
                <option value="2">July 2021</option>
                <option value="3">August 2021</option>
                <option value="4">September 2021</option>
                <option value="5">October 2021</option>
                <option value="6">November 2021</option>
                <option value="7">December 2021</option>
              </select>
              <div className="w-4 h-4 absolute m-auto inset-0 mr-4 pointer-events-none cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chevron-down"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center mb-5">
        <div className="w-full py-4 sm:py-6 md:py-8 bg-white shadow rounded-lg">
        <h2 className="text-lg px-6 mb-5">RealTime Summary</h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 px-6 xl:px-10 gap-y-8 gap-x-12 2xl:gap-x-28">

            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Unearned Income
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {totalFunding}
              </p>
            </div>

            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Voucher Purchase
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {totalVouchers}
              </p>
            </div>

            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Games Played
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {totalGames}
              </p>
            </div>
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Winnings paid out
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {totalWinnings}
              </p>
            </div>
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Margin
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {margin}
              </p>
            </div>
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Tax
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {tax}% ({taxAmount(totalGames + totalVouchers, tax)})
              </p>
            </div>
           
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium leading-none text-gray-500 uppercase">
                Profit
              </p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-3 text-gray-800 mt-3 md:mt-5">
                {profit}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Percentage
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Shared Due
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.email}>
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
                      <div className="text-sm text-gray-900">
                        {person.percentage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {((margin / 100) * person.percentage).toFixed(2)}{" "}
                        (unpaid)
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Deposits
                      </a>
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
