import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { register } from './api';
import { useLocalStorage } from "hooks/useLocalStorage";

function Index(props) {

    let [error, setError] = useState("")
    
    let [agent, setAgent] = useState({
        password: '',
        email: 'placeholder@email.com',
    })

    const updateField = e => {
        setAgent({
            ...agent,
            [e.target.name]: e.target.value
        });
    };

    let authenticate = (e) => {
        e.preventDefault()
        console.log(agent)
        register(agent).then(t => {
            setToken(JSON.stringify(t.data))
            setNotice("")
        }).catch((e) => {
            setError("Invalid username/password")
        })
    }
    return (
        <>
            <div className="container mx-auto px-4 h-full">

                <div className="flex content-center items-center justify-center h-full">

                    <div className="w-full lg:w-5/12 px-4">
                        <div className="relative flex flex-col min-w-0 break-words w-full mb-6  rounded-lg bg-gray-900 border-0">

                            <div className="flex-auto px-4 lg:px-10 py-10 pb-3 pt-0">

                                <div className="text-green-200 text-center mb-3 font-bold pt-5 text-base">
                                    <p className="my-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-100 sm:text-4xl">Congratulation</p>
                                    <h5>Set your password</h5>
                                </div>
                                <form onSubmit={authenticate} >
                                    <div className="relative w-full mb-3">

                                        <input
                                            type="text"
                                            required
                                            name="password"
                                            value={agent.email}
                                            disabled
                                            className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-green-200 text-xs font-bold mb-2"
                                            htmlFor="password"
                                        >
                                            Set Password </label>
                                        <input
                                            type="password"
                                            required
                                            name="password"
                                            value={agent.password}
                                            onChange={updateField}
                                            className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Set password"
                                        />
                                    </div>

                                    <div className="relative w-full mb-3">
                                        <label
                                            className="block uppercase text-green-200 text-xs font-bold mb-2"
                                            htmlFor="c_password"
                                        >
                                            Confirm Password </label>
                                        <input
                                            type="text"
                                            required
                                            name="c_password"
                                            value={agent.c_password}
                                            onChange={updateField}
                                            className="border-0 px-3 py-3 placeholder-gray-600  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            placeholder="Confirm password"
                                        />
                                    </div>



                                    {error && <small className="text-red-400">{error}</small>}

                                    <div className="text-center mt-6">
                                        <button
                                            className="bg-green-800 text-white active:bg-green-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                            type="submit">  Set Password  </button>
                                    </div>
                                </form>
                                <div className="w-full text-center mt-2">
                                    <Link to="/auth/login" className="text-green-200">
                                        <small>Cancel</small>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
Index.propTypes = {

};
export default Index;