import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { findTransactions } from "./api";

function WalletDetail(props) {
    const location = useLocation()
    const { wallet } = location.state

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();


    const [filter, setFilter] = useState({
        content: "",
        type: "",
        ref: "",
        start: 962641361,
        end: Date.now(),
    });

    let loadTransactions = async (account) => {
        setIsLoading(true)
        try {
            let response = await findTransactions(id)
            if (response.status !== "SUCCESS") {
            } else {
                console.log(response.data)
                setTransactions(response.data.transactions)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (wallet) {
            loadTransactions()
        }
        return () => { };
    }, [wallet]);

    return (
        <>
            <div className="flex flex-col items-center justify-between w-full">
                <div className="flex flex-col  w-full items-start lg:items-center rounded  my-3">
                    <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto my-2">
                        <h3 className="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">{wallet.title}</h3>
                    </div>
                    <table className="divide-y divide-gray-200 mx-auto overflow-x-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Title </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Amount </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">  Reference </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >Date  </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map(transaction => <TransactionItem transaction={transaction} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function FilterBox({ filter, setFilter }) {
    return (
        <div>
            <div className="flex flex-col lg:mr-16">

                <label
                    for="email"
                    className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
                >
                    Description and Transaction Ref
                </label>
                <input
                    id="email"
                    name="content"
                    autocomplete="off"
                    className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                    placeholder="Placeholder"
                    onChange={(e) =>
                        setFilter({ ...filter, content: e.target.value })
                    }
                />
            </div>

            <div className="flex flex-col lg:py-0 py-4">
                <label
                    for="email1"
                    className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
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
                    className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                    placeholder="example@example.com"
                />
            </div>
            <div className="flex flex-col lg:py-0 py-4">
                <label
                    for="email1"
                    className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2"
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
                    className="text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow"
                    placeholder="example@example.com"
                />
            </div>

        </div>
    )
}


function TransactionItem({ transaction }) {
    return (
        <>
            <tr className={"" + (transaction.class == "CREDIT" ? "bg-green-50" : "bg-red-50")}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-500"> {transaction.description} </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₦{transaction.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.reference}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {new Date(transaction.created_at * 1000).toLocaleDateString()}
                </td>
            </tr>
        </>
    );
}

export default WalletDetail;
