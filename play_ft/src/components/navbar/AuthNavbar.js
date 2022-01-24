import React from 'react';
import PropTypes from 'prop-types';

function AuthNavbar(props) {
    const [navbarOpen, setNavbarOpen] = React.useState(false);

    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full z-10 bg-black  flex justify-between items-center p-2 navbar-expand-lg">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        {/* Brand */}
                        <a
                            className="text-white text-medium uppercase hidden lg:inline-block font-bold"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                        >
                            Eliest
          </a>
                        <button
                            className="cursor-pointer text-xl text-white leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>

                    <div
                        className={
                            "lg:flex flex-grow items-center  lg:bg-opacity-0 lg:shadow-none" +
                            (navbarOpen ? " block rounded shadow-lg" : " hidden")
                        }
                        id="example-navbar-warning"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="flex items-center">
                                <a
                                    className="lg:text-white lg:hover:text-blueGray-200 text-white px-3 py-2 lg:py-2 flex items-center text-xs uppercase font-bold"
                                    href="#"
                                    target="_blank"
                                >
                                    <i className="lg:text-gray-100 fab fa-facebook text-lg leading-lg " />
                                    <span className="lg:hidden inline-block ml-2">Share</span>
                                </a>
                            </li>

                            <li className="flex items-center">
                                <a
                                    className="lg:text-white lg:hover:text-blueGray-200 text-white px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                                    href="#"
                                    target="_blank" >
                                    <i className="lg:text-gray-100  fab fa-twitter text-lg leading-lg " />
                                    <span className="lg:hidden inline-block ml-2">Tweet</span>
                                </a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}

export default AuthNavbar;