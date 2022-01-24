import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Logo from '../../assets/img/logo_white.png'
import Wave from '../../assets/img/wave.png'
import { findWallet } from './api';
import { Link } from 'react-router-dom'

const Wallet = ({ wallet, index }) => {

    const [tinyLoading, setTinyLoading] = useState(false);
    const [detail, setDetail] = useState(null);

    let getWallet = async (walletId) => {
        setTinyLoading(true)
        try {
            let response = await findWallet(walletId)
            if (response.status !== "SUCCESS") {
            } else {
                let query = response.data.walletquery
                console.log(query)
                setDetail(query)
            }
        } catch (error) {
            setDetail(null)
        } finally {
            setTinyLoading(false)
        }
    };

    useEffect(() => {
        getWallet(wallet.id)
        return () => { };
    }, []);

    return (
        <div className={"winning-wall rounded-xl w-full md:w-2/3 px-5 py-10  " + ([" winning-wall ", " funded-wall"][index])} style={{ backgroundImage: `url(${Wave})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <div className="">
                <img className="wall-logo" src={Logo} />
            </div>

            <div className="text-center">
                <div className="win--text mx-5">{wallet.title}</div>
                {wallet.id && <h3 className="my-3 leading-5  text-gray-100 font-extrabold text-2xl text-center">
                    ₦ {detail && detail.balance.toFixed(2)}   {tinyLoading && <i class="fas fa-spinner fa-pulse"></i>} </h3>}
                <Link to={{ pathname: "/agent/transactions/", state: { wallet: detail } }} className="nav-button bg-white hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">Transactions</Link>
            </div>
        </div>
    );
};




export default Wallet;
