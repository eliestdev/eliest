import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fundAccountIcon, generateVoucherIcon, alertIcon } from 'components/icons'
import useFetch from 'react-fetch-hook';
import { removeAuthToken } from 'features/authentication/authSlice';
import { setAuthError } from 'features/authentication/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from 'features/authentication/authSlice';
import { Link } from 'react-router-dom';

Index.propTypes = {

};

function Index(props) {

    const [agent, setAgent] = useState({});
    const [inactive, setShowInactive] = useState(false);

    const dispatch = useDispatch();
    const token = useSelector(selectToken);

    const { isLoading, data, error } = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/profile`, {
        headers:{
            "Authorization": "Bearer " + JSON.parse(token).access_token
        }
    });
    
    if (error){
        if (error.status == 401){
            dispatch(removeAuthToken()); dispatch(setAuthError(""))
        }
    }



    return (
        <>
            <div class="px-4 pb-4 pt-20 lg:justify-between lg:p-4 md:p-4 sm:pt-20 w-full">
                <div class="flex-1 min-w-0 p-4">
                    <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-2">
                        Quick Actions  </h2>
                </div>
                <hr />
                <div class="grid gap-4 sm:grid sm:h-32 sm:grid-flow-row sm:gap-8 sm:grid-cols-3 mt-10">
                   

                {
                     data&&(   data.account_verified == true ? (<></>):(<div class="relative shadow p-4">
                        <Link to="/agent/profile">
                            
                        <dt>
                            <div class="absolute flex items-center font-bold justify-center h-12 w-12 rounded-md bg-red-800 text-white">
                               
                            </div>
                            <p class="ml-16 text-lg leading-6 font-medium text-red-600">Actions required</p>
                        </dt>
                        <dd class="mt-1 ml-16 text-sm text-gray-500">
                           Your action is not active
                        </dd>
                        </Link>
                    </div>))
                    }
                
                    <ActionItem title="Notifications" caption="0 new notifications" icon={alertIcon()} link="/agent/notifications" setShowInactive={setShowInactive} data={data}/>
                    <ActionItem title="Fund Wallet" caption="You can fund your wallet" icon={fundAccountIcon()} link="/agent/wallets" />
                    <ActionItem title="Generate Vouchers" caption="You can fund your wallet" icon={generateVoucherIcon()} link="/agent/vouchers" />
                    <Inactive show={inactive}/>
                </div>
            </div>
        </>
    );
}

function ActionItem({ title, caption, icon, link }) {
    return (
        <>
            <div class="relative shadow p-4" onClick={()=>{}}>
                <Link to={link}>
                <dt>
                    <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                        {icon}
                    </div>
                    <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
                </dt>
                <dd class="mt-1 ml-16 text-sm text-gray-500">
                    {caption}
                </dd>
                </Link>
            </div>
        </>
    )
}

export default Index;

const Inactive = ({show}) => {
    return (
        <div>
            <div className={"py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0 " + (show == true ? "block" : "hidden")} id="modal" >
                <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                    <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                        <div className="w-full flex items-center text-green-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width={40} height={40} viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <circle cx={12} cy={12} r={9} />
                                <path d="M9 12l2 2l4 -4" />
                            </svg>
                            <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight ml-2">Payment Processing Successful</h1>
                        </div>
                        <p className="mb-5 text-sm text-gray-600 font-normal">Your Payment was successful. You can now use our services. Check the action below for more details. Thank you</p>
                        <div className="flex items-center w-full">
                            <button className="focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 bg-indigo-700 rounded text-white px-8 py-2 text-xs sm:text-sm">Manage Plan</button>
                            <button className="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-4 sm:px-8 py-2 text-xs sm:text-sm" onclick="modalHandler()">
                                Cancel
                            </button>
                        </div>
                        <div className="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out" onclick="modalHandler()">
                            <svg xmlns="http://www.w3.org/2000/svg" aria-label="Close" className="icon icon-tabler icon-tabler-x" width={20} height={20} viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <line x1={18} y1={6} x2={6} y2={18} />
                                <line x1={6} y1={6} x2={18} y2={18} />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    );
};
