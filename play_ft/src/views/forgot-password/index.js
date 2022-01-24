import { useRef } from 'react';
import Header from '../../components/header'
import { Link, Redirect } from "react-router-dom";

const ForgotPassword = () => {
    let form = useRef(null);

    const updateField = (e) => {
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();

    };
    return (
        <>
            <section className="login--section">
                <Header />
                <div className="mx-auto flex justify-center lg:items-center h-full">
                    <form ref={form} onChange={updateField} onSubmit={handleSubmit} className="sm:w-4/6 lg:w-4/12 xl:w-5/12 py-6 px-2 sm:px-0">
                        <div className="pt-10 px-2 flex flex-col items-center justify-center">
                            <h3 className="login-text--big">Forgot password?</h3>
                        </div>

                        <div className="pt-6 items-center justify-center">
                            <div className="login-text--small">Still keep track of your account and games</div>
                        </div>

                        <div className="mt-8 w-full px-2 sm:px-6">
                            <div className="flex flex-col mt-5">
                                <input required id="email" name="email" className="h-18 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" id="inline-full-name" type="email" placeholder="Enter your email address" />
                            </div>
                        </div>
                       
                        <div className="px-2 sm:px-6 mt-4">
                            <button className="focus:outline-none w-full bg-green-600 transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big">Recover</button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default ForgotPassword;