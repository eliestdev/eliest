import { useState } from 'react';
import PropTypes from 'prop-types';
import Logo from '../../assets/img/logo.png'
import './index.css'
import { withRouter, Link } from 'react-router-dom';

AuthNavbar.propTypes = {

};

function AuthNavbar(props) {
    const routes = [
        '/auth/login',
        '/auth/register',
        '/auth/resetpassword',
        '/auth/setpassword'
    ]

    const { location } = props;

    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <>
            {routes.includes(location.pathname) && <div>
                <div className="mobile--nav">
                    <img className="header--logo items-center content-center mx-auto" src={Logo} />
                    <div className="flex gap-2 px-6 mt-6">
                        <a className="tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" href="https://www.eliestlotto.biz/">Home</a>

                        <a href="https://supervisors.eliestlotto.biz/" className="tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                            Become a supervisor
                        </a>

                        <Link to="/auth/register" className="tbutton bg-green-500 md:bg-transparent hover:bg-green-600 text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
                            Become an agent
                        </Link>
                    </div>
                </div>
                <div className="desk--nav flex justify-between gap-5 px-6 place-items-start pt-5">
                    <div className="sm:hidden md:grid">
                        <img className="header--logo" src={Logo} />
                    </div>
                    <div className="justify-between sm:gap-5 md:gap-3 mt-3">
                        <a className="tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded" href="https://www.eliestlotto.biz/">Home</a>

                        <a href="https://supervisors.eliestlotto.biz/" className="ml-3 tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become a supervisor
                        </a>

                        <a href="https://www.eliestlotto.biz/how/agent" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            How to become an agent
                        </a>
                        <Link to="/auth/register" className="ml-3 tbutton sm:bg-green-500 md:bg-transparent hover:bg-green-600 sm:text-white md:text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded">
                            Become an agent
                        </Link>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default withRouter(AuthNavbar);