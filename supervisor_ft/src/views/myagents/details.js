import Chart from "components/chart/chart";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAgent, getWallets, getTransaction, getTransactions } from "./api";
import { showFullDate } from '../../helper/fullDate';
import NumberFormat from 'react-number-format';

export default function Index(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ profile: {}, transactions: { transactions: [] } });
  const [filter, setFilter] = useState({ content: "", type: "", ref: "", start: 962641361, end: Date.now(), });
  const [transactions, setTransactions] = useState([]);

  const { id } = useParams();

  let getProfile = async () => {
    setIsLoading(true)
    try {
      let response = await getAgent(id)
      if (response.status != "SUCCESS") {
      } else {
        setData(response.data)
        const a = await getWallets(response.data.profile.id)
        const funded = a.data.wallets.find(a => a.title === "Funded Wallet");
        const t = await getTransaction(funded.id)
        const max = new Date().getTime();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var dayOfWeek = days[new Date(max).getDay()]
        console.log(dayOfWeek)
        const datePar = findWeeklyFundings(max);
        const all = await getTransactions(t.data.transaction.account, t.data.transaction.reference, t.data.transaction.class, t.data.transaction.description, t.data.transaction.supervisor, datePar.from, datePar.to);
        setTransactions(all.data.transactions);
        const sort = all.data.transactions.sort(compare)
        console.log(sort)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  const compare = (a,b) => {
    if(a.created_at < b.created_at) {
      return -1
    }

    if(a.created_at > b.created_at) {
      return 1;
    }

    return 0;
  }

  const findWeeklyFundings = (timestamp) => {
    var curr = new Date(timestamp);
    var first = curr.getDate() - curr.getDay();
    var last = first + 6;
    return { from: curr.setDate(first), to: curr.setDate(last) };
  }

  useEffect(() => {
    getProfile()
  }, []);

  return (
    <div className="flex flex-col">
      <div className="my-2 overflow-x-auto sm:mx-6 lg:mx-8">
        <h2 className="text-xl tracking-tight font-extrabold text-gray-900 mb-2">
          Agent Profile
        </h2>


        <table className="w-full lg:w-2/3 text-xs">
          <thead>
            <tr>
              <td className="border p-1">First name</td>
              <td className="border p-1">{data.profile.firstname}</td>
            </tr>
            <tr>
              <td className="border p-1">Last name</td>
              <td className="border p-1">{data.profile.lastname}</td>
            </tr>
            <tr>
              <td className="border p-1">Address</td>
              <td className="border p-1"> {data.profile.address} --- {data.profile.state} ---{" "}
                {data.profile.lg}</td>
            </tr>
            <tr>
              <td className="border p-1">Phone and Email</td>
              <td className="border p-1">{data.profile.phone} -- {data.profile.email}</td>
            </tr>
            <tr>
              <td className="border p-1">Referral Code</td>
              <td className="border p-1">{data.profile.refcode}</td>
            </tr>
          </thead>
        </table>

        <div className="py-2  min-w-full">
          <h2 className="text-xl tracking-tight font-extrabold text-gray-900 mb-2">
            Funding Record
          </h2>
          <div className="overflow-auto  border-gray-100 border-b px-3 text-xs">
            {transactions.map(transaction =>
              <p className="my-1">Funded: <NumberFormat thousandSeparator={true} prefix={'N'} displayType={'text'} value={transaction.amount} /> on {showFullDate(transaction.created_at)}</p>
            )}
          </div>
          <Chart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

