import { useState } from "react";
import { useEffect } from "react";
import { findTransactions } from "./api";
export default function Index() {

  const [isLoading, setIsLoading] = useState(false);

  let timeInUnix = (hour, minute, sec) => {
    var time = new Date;
    time.setHours(hour);
    time.setMinutes(minute);
    time.setSeconds(sec);
    var timestamp = Math.floor(time / 1000);
    return timestamp
  }

  const handleTimelineChange = (e, hour, min, sec) => {
    let init = 962641361;
    if (e.target.value) {
      init = new Date(e.target.value).setHours(hour, min, sec, 59);
    }
    let copyFilter = { ...filter }
    copyFilter[e.target.name] = Math.floor(init / 1000)
    setFilter(copyFilter);
  }

  let loadTransactions = async () => {
    setIsLoading(true)
    try {
      let response = await findTransactions(filter.from, filter.to)
      if (response.status !== "SUCCESS") {
      } else {
        setTransactions(response.data)
        setTransactionDisplay(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const [filter, setFilter] = useState({
    content: "",
    type: "",
    ref: "",
    from: timeInUnix(0, 0, 0),
    to: timeInUnix(23, 59, 59)
  });

  useEffect(() => {
    loadTransactions()
    return () => { };
  }, []);

  useEffect(() => {
    setTransactionDisplay(transactions.filter(x => x.reference.toLowerCase().includes(filter.content.toLowerCase()) || x.account.toLowerCase().includes(filter.content.toLowerCase()) || x.amount.toString().toLowerCase().includes(filter.content.toLowerCase()) ))
    return () => {

    }
  }, [filter])


  const [transactions, setTransactions] = useState([]);
  const [display, setTransactionDisplay] = useState([]);

  return (
    <div className="flex flex-col text-xs">
      <div className="-my-2 overflow-x-auto mx-5 flex justify-between md:flex-col lg:flex-row">
        <div>
          <h2 className="text-4xl tracking-tight font-extrabold text-gray-900">
            All financial Activity
          </h2>
          <p>From: {new Date(filter.from * 1000).toLocaleString()}</p>
          <p>To: {new Date(filter.to * 1000).toLocaleString()}</p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <p>From: </p>
            <input type="date" name="from" onChange={(e) => handleTimelineChange(e, 0, 0, 0)} class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7" />
            <p>To: </p>
            <input type="date" onChange={(e) => handleTimelineChange(e, 23, 59, 59)} name="to" class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7" />
          </div>
          <div className="flex space-x-2">
            <p>Memo: </p>
            <input
            
              onChange={(e) => setFilter({ ...filter, content: e.target.value })}
              class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7"
              placeholder="search here" />
            <p>Group: </p>
            <select
              onChange={(e) => setFilter({ ...filter, ref: e.target.value })}

              class="text-gray-600 bg-white font-normal flex items-center p-1 text-sm border-gray-300 rounded border max-h-7" >
              <option value="">ALL</option>
              <option value="GAME PLAY FEE">GAME PLAY FEE</option>
              <option value="GAMES WINNING PAYOUT">GAMES WINNING PAYOUT</option>
              <option value="WIN TRANSFER">WIN TRANSFER</option>
              <option value="VOUCHER GENERATED">VOUCHER GENERATED</option>
              <option value="REFERRAL BONUS">REFERRAL BONUS</option>
            </select>
          </div>
          <div className="flex space-x-2 justify-center">
            <button className="px-5 py-1 bg-gray-800 text-gray-100 rounded" onClick={() => loadTransactions()}>Search</button>
          </div>
        </div>
      </div>

      <div>
        <div className="py-2 align-middle inline-block min-w-full px-5">
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">


            <h6 className="p-2 bg-gray-100 my-2">{display.length} Transactions Found</h6>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="font-bold bg-gray-800 text-gray-100">
                  <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Date </th>
                  <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Reference </th>
                  <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Amount </th>
                  <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Description </th>
                  <th scope="col" className="px-6 py-3 text-left    uppercase tracking-wider"> Act Ref </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {display.map(transaction =>

                  <tr className="font-bold text-gray-800">
                    <td scope="col" className="px-6 py-3 text-left bg-gray-100    uppercase tracking-wider">
                      <h6>{new Date(transaction.created_at * 1000).toLocaleString()} </h6>
                    </td>
                    <td scope="col" className="px-6 py-3 text-left bg-white    uppercase tracking-wider">
                      <h6>{transaction.reference} </h6>
                    </td>
                    <td scope="col" className="px-6 py-3 text-left bg-gray-100    uppercase tracking-wider">
                      <h6>{transaction.amount} </h6>
                    </td>
                    <td scope="col" className="px-6 py-3 text-left bg-white    uppercase tracking-wider">
                      <h6>{transaction.description} </h6>
                    </td>
                    <td scope="col" className="px-6 py-3 text-left bg-gray-100    uppercase tracking-wider">
                      <h6>{transaction.account} </h6>
                    </td>
                  </tr>)}
              </tbody>
            </table>


          </div>
        </div>
      </div>


    </div>
  );
}
