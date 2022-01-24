import React, { useEffect, useState } from 'react'
import { getWallet, getWallets } from "./api";
import NumberFormat from 'react-number-format';

const Balance = ({ agent }) => {
    const [balance, setBalance] = useState(0);

    let fetchBalance = async (id) => {
        const res = await getWallets(id);
        const data = res.data.wallets;

        data.reduce(async (filtered, option) => {
            if (option.title === "Funded Wallet") {
                const wall = await getWallet(option.id);
                setBalance(wall.data.walletquery.balance);
                return option;
            }

            return filtered;
        }, [])
    }

    useEffect(() => fetchBalance(agent.id), [])

    return (
        <span className="mr-2">
           Curr Bal: <span className="ml-1"><NumberFormat thousandSeparator={true} prefix={'N'} displayType={'text'} value={balance}/></span>
        </span>
    );
}

export default Balance;