import React, { useEffect, useState } from 'react'
import { getWallets, getTransaction, getTransactions } from './api';
import RecentAgent from './recentAgents';

const RecentFundings = ({ agents }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState([]);

    const getBalances = () => {
        const ids = agents.map(a => a.id);
        ids.forEach((id) => fetchAllAgentBalance(id, ids))
        setIsLoading(false);
    }

    let fetchAllAgentBalance = async (id, ids) => {
        const res = await getWallets(id);
        const data = res.data.wallets;

        data.reduce(async (filtered, option) => {
            if (option.title === "Funded Wallet") {
                const trans = await getTransaction(option.id);
                const t = trans.data.transaction;

                const all = await getTransactions(t.account, t.reference, t.class, t.description, t.supervisor);
                const agentTransactions = all.data.transactions.map(a => a);

                if (balance.length !== ids.length) {
                    setBalance(oldArray => [...oldArray, agentTransactions[0]]);
                }

                if (balance.length === ids.length) {
                    const so = balance.sort((a, b) => b.created_at - a.created_at);
                    setBalance(so);
                }
            }
        }, [])
    }

    useEffect(() => getBalances(), [])

    return (
        <div>
            {isLoading && <div className="flex text-center">
                Loading... Please wait
            </div>
            }

            {/* {balance.length > 0 && agents.length === balance.length && balance.map((agent) => <QueriedAgent agent={agent} balances={balance} />)} */}
            {balance && balance.length > 0 && agents.length === balance.length && balance.map((a) => <RecentAgent agents={agents} transaction={a} />)}
        </div>
    )
}

export default RecentFundings;