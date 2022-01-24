import React, { useState, useEffect } from 'react'
import { getWallet, getWallets } from './api';
import QueriedAgent from './showQueriedAgent';

const LeastFundings = ({ agents, loading }) => {
    const [balance, setBalance] = useState([]);

    let fetchAllAgentBalance = async (id) => {
        const res = await getWallets(id);
        const data = res.data.wallets;

        data.reduce(async (filtered, option) => {
            if (option.title === "Funded Wallet") {
                const wall = await getWallet(option.id);
                setBalance(oldArray => [...oldArray, wall]);
            }
        }, [])
    }

    useEffect(() => {
        if (balance.length !== agents.length) {
            agents.forEach(async (agent) => {
                fetchAllAgentBalance(agent.id);
                if (balance.length === agent.length) {
                    balance.sort((a, b) => a.data.walletquery.balance - b.data.walletquery.balance);
                }
            })
        }
    }, [])


    return (
        <div>
            {loading && <div className="flex text-center">
                Loading... Please wait
            </div>
            }

            {balance.length > 0 && agents.length === balance.length && agents.map((agent) => <QueriedAgent agent={agent} balances={balance} />)}
        </div>
    );
}

export default LeastFundings;