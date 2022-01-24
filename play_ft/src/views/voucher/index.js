import { selectToken } from "features/authentication/authSlice";
import React, { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import Inactive from "components/alerts/inactive";




function Index({ profile }) {

    const [totalCost, setTotalCost] = useState(0);
    const [makeVoucherCall, setMakeVoucherCall] = useState(null);
    const [values, setValues] = useState({ "amount": 0, "quantity": 0 });


    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    let history = useHistory();

    const textChange = (e) => {

        let updatedValue = { ...values }
        updatedValue[e.target.name] = Number(e.target.value)

        setValues(updatedValue)
    }

    useEffect(() => {
        setTotalCost(values.quantity * values.amount)
        return () => {

        };
    }, [values]);

    const { isLoading, data, error } = useFetch(
        `${process.env.REACT_APP_ENDPOINT_URL}agent/voucher/new`,
        {
            depends: [makeVoucherCall],
            method: "POST",
            headers: {
                "Content-Type": "application/json",

                "Authorization": "Bearer " + JSON.parse(token).access_token
            },
            body: JSON.stringify(values),
        }
    );
    if (data) {
        if (data.batch) {
            history.push("/agent/voucher_batches")
        };
    }
    if (error) {
        if (error.status == 401) {
            console.log("Invalid Username/password");
        }
    }



    return (
        <>
            {(profile && !profile.account_verified) ? (<Inactive/>) : (
                    <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
                        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                <form onSubmit={(e) => { e.preventDefault(); setMakeVoucherCall(true); }} className="w-2/3 lg:w-1/2 flex justify-center bg-white dark:bg-gray-900 mx-auto shadow">
                                    <div className="w-full sm:w-4/6 md:w-3/6 lg:w-2/3 text-gray-800 dark:text-gray-100 flex flex-col justify-center px-2 sm:px-0 py-16">
                                        <div className="px-2 sm:px-6">
                                            <h3 className="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">Generate new vouchers</h3>
                                        </div>
                                        <div className="mt-8 w-full px-2 sm:px-6">
                                            <div className="flex flex-col mt-8">
                                                <label for="email" className="text-lg font-semibold leading-tight">
                                                    Voucher Amount
                                        </label>
                                                <select name="amount" onChange={textChange} className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow">
                                                    <option defaultValue="0">--select amount--</option>
                                                    <option value="100">₦100</option>
                                                    <option value="200">₦200</option>
                                                    <option value="400">₦400</option>
                                                    <option value="500">₦500</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col mt-5">
                                                <label for="password" className="text-lg font-semibold fleading-tight">
                                                    How many
                                        </label>
                                                <input id="quantity" onChange={textChange} name="quantity" required aria-required="true" name="quantity" type="number" className="h-10 px-2 w-full rounded mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 dark:focus:border-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-300 border shadow" />
                                            </div>
                                        </div>
                                        <div className="pt-6 w-full flex justify-between px-2 sm:px-6">
                                            <div className="flex items-center bg-gray-800 text-gray-50 font-bold p-2 w-full rounded">
                                                <p className="text-base">
                                                    Total Amount Due: {totalCost}
                                                </p>
    
                                            </div>
                                        </div>
                                        <div className="flex px-2 sm:px-6 w-full justify-center">
                                            <button type="submit" className=" self-center mx-auto focus:outline-none w-full sm:w-auto bg-indigo-700 transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm mt-6">
                                                Pay {totalCost}
                                            </button>
    
                                        </div>
                                    </div>
                                </form>
    
                            </div>
                        </div>
                    </div>
                </div>
         )}

       </>);
}
export default Index;

