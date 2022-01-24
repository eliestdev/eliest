import { setAuthError } from 'features/authentication/authSlice';
import { removeAuthToken } from 'features/authentication/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Wave from '../../assets/img/wave.png'
import { MenuIcon } from '@heroicons/react/outline'
import { showSideBar } from 'features/utils/utilSlice';
import './index.css';
import WalletTransactions from 'views/wallets/detail';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { findTransactions } from './api';

const Transactions = () => {
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.auth.profile);
    const mobileBar = useSelector((state) => state.utility.mobileBar);
    const location = useLocation()
    const { wallet } = location.state

    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    let loadTransactions = async (account) => {
        setIsLoading(true)
        try {
          let response = await findTransactions(wallet.info.id)
          if (response.status !== "SUCCESS") {
          } else {
            setTransactions(response.data.transactions)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      };
    
      useEffect(() => {
        if (wallet.info) {
          loadTransactions()
        }
        return () => { };
      }, [wallet]);


    return (
        <div>
            <div className="header-bg" style={{ backgroundImage: `url(${Wave})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="flex justify-between py-8 px-12 header-bg">
                    <div className="cursor-pointer block sm:hidden" onClick={() => { dispatch(showSideBar(!mobileBar)); }} >
                        <MenuIcon className="h-8 w-8 " />
                    </div>
                    <div>
                        <div className="transaction-header">{wallet.info.title} transactions</div>
                        <div className="transaction-text pt-4">Search for a specific transaction</div>

                        <div className="flex mt-10 gap-4">
                            <select
                                placeholder="Reference number" className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500">
                                <option disabled selected>
                                    Reference number
                                </option>

                            </select>

                            <input className="h-18 bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" placeholder="Enter value" />
          
                        </div>

                        <button className="mt-4 mb-4 btn-primary text-white tbutton px-8 py-2 rounded">Search</button>
                    </div>
                    <div className="flex gap-4 h-12 pt-1 mt-1">
                        {profile.activated && <button className="nav-button bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                            Activate account
                        </button>}

                        <button onClick={(e) => { e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError("")) }} className="nav-button bg-red-500 hover:bg-red-500 text-white font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <WalletTransactions transactions={transactions} />
        </div>
    );
}

export default Transactions;