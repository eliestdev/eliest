import React from 'react';
import Logo from '../../assets/img/logo.png'
import './index.css'
import { withRouter, Link } from 'react-router-dom';

import PropTypes from 'prop-types';

AuthNavbar.propTypes = {};

function AuthNavbar(props) {
    const routes = [
        '/auth/login',
        '/auth/register',
        '/auth/resetpassword',
        '/auth/setpassword'
    ]

    const { location } = props;

    return (
        <>
            {routes.includes(location.pathname) && <div>
                <div className="mobile--nav">
                    <img className="header--logo items-center content-center mx-auto" src={Logo} />
                    <div className="flex gap-2 px-6 mt-6">
                        <a href="https://www.eliestlotto.biz/" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Home
                        </a>
                        <Link className="tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become a supervisor
                        </Link>

                        <a href="https://agents.eliestlotto.biz/" className="tbutton bg-green-500 md:bg-transparent hover:bg-green-600 text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become an agent
                        </a>
                    </div>
                </div>
                <div className="desk--nav flex sm:justify-between sm:gap-5 sm:px-6 md:gap-2 md:place-items-start py-5">
                    <span className="sm:hidden md:grid">
                        <img className="header--logo" src={Logo} />
                    </span>
                    <div className="justify-between sm:gap-5 md:gap-3 pt-5">
                        <a href="https://www.eliestlotto.biz/" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Home
                        </a>
                        <a href="https://www.eliestlotto.biz/how/supervisor" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            How to become a supervisor
                        </a>
                        <Link to="/auth/register" className="ml-3 tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become a supervisor
                        </Link>

                        <a href="https://agents.eliestlotto.biz/" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become an agent
                        </a>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default withRouter(AuthNavbar);