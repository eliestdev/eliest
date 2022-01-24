import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { removeAuthToken } from 'features/authentication/authSlice';
import { setAuthError } from 'features/authentication/authSlice';

Index.propTypes = {

};

function Index(props) {
    const dispatch = useDispatch();

    const [collapseShow, setCollapseShow] = React.useState("-translate-x-full");

    let toggleShow = () => {
        collapseShow == "-translate-x-full" ? setCollapseShow("") : setCollapseShow("-translate-x-full")
    }

    return (
        <>
            <div className="relative md:flex">

                <div className="bg-gray-800 text-gray-100 flex justify-between md:hidden sm:flex h-auto items-center p-4 absolute top-0 left-0 right-0 overflow-y-auto overflow-x-hidden">
                    <Link to="/" className="block  text-white font-bold align-center m-0">Eliest lotto</Link>

                    <button className="mobile-menu-button  focus:outline-none focus:bg-gray-700 m-0" onClick={() => { toggleShow() }} >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <div className={"sidebar bg-gray-800 text-green-100 w-64 space-y-6 py-7 absolute inset-y-0 left-0 z-40 transform md:relative md:translate-x-0 transition duration-200 ease-in-out min-h-screen " + collapseShow}>

                    <Link to="/" className="text-white flex items-center space-x-2 px-4">
                        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <span className="text-2xl font-extrabold">Eliest</span>
                    </Link>

                    <nav>
                        <Link to="/agent/dashboard" className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white " + (window.location.pathname == "/agent/dashboard" ? "bg-white text-green-900 font-bold" : "")}>
                            Quick Actions
    </Link>
                        <Link to="/agent/wallets" className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white " + (window.location.pathname == "/agent/wallets" ? "bg-white text-green-900 font-bold" : "")}>
                            Wallets
    </Link>
                        <Link to="/agent/vouchers" className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white " + (window.location.pathname == "/agent/vouchers" ? "bg-white text-green-900 font-bold" : "")}>
                            Vouchers
    </Link>
                        <Link to="/agent/notifications" className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white " + (window.location.pathname == "/agent/notifications" ? "bg-white text-green-900 font-bold" : "")}>
                            Notification
    </Link>
                        <Link to="/agent/profile" className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white " + (window.location.pathname == "/agent/profile" ? "bg-white text-green-900 font-bold" : "")}>
                            Profile
    </Link>
                        <br />
                        <hr />
                        <Link to="/auth" onClick={(e) => { e.preventDefault(); dispatch(removeAuthToken()); dispatch(setAuthError("")) }} className={"block py-2.5 px-4  transition duration-200 hover:bg-green-700 hover:text-white "}>
                            Sign out
    </Link>      </nav>
                </div>
            </div>
        </>
    );
}

export default Index;

