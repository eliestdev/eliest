import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getValues } from 'views/values/api';


const Summary = () => {

    const [values, setValues] = useState({});
    const [entry, setEntry] = useState({ totalPAYOUT: 0.0, totalGAMEPLAY: 0.0, bat: 0.0, bbt: 0.0, tax: 0 });
    let loadParams = async () => {
        try {
            let response = await getValues()
            if (response.status !== "SUCCESS") {
                alert(response.message)
            } else {
                setValues(response.data)
                setEntry({ ...entry, tax: response.data["302"] })

                // window.location.reload()
            }
        } catch (error) {
            console.log(error)
        } finally {
        }
    };


    const location = useLocation()
    const filter = location.state.filter
    const transactions = location.state.transactions
    const PAYOUT = "GAMES WINNING PAYOUT"
    const GAMEPLAY = "GAME PLAY FEE"
    const VOUCHERSALE = "VOUCHER GENERATED SUCCESSFULLY"


    function percentage(percent, total) {
        return ((percent / 100) * total).toFixed(2)
    }

    function fill() {

        let _totalPAYOUT = 0
        let _totalGAMEPLAY = 0
        transactions.forEach(element => {
            if (element.description == PAYOUT) {
                _totalPAYOUT += element.amount
            }
            if (element.description == GAMEPLAY) {
                _totalGAMEPLAY += element.amount
            }

        });

        setEntry({...entry, totalGAMEPLAY:_totalGAMEPLAY, totalPAYOUT:_totalPAYOUT })
    }


    useEffect(() => {
        loadParams().then(() => {
            fill()
        })
        return () => {
        }
    }, [])

    useEffect(() => {
        // setEntry({...entry, bbt: entry.totalGAMEPLAY - entry.totalPAYOUT})
        //  setEntry({...entry, bat: entry.bbt - percentage(entry.tax, entry.bbt)})
        let _bbt = entry.totalGAMEPLAY - entry.totalPAYOUT
        let _bat = _bbt - percentage(values["302"], _bbt)
        // alert(_bat)
        setEntry({ ...entry, bbt: _bbt, bat: _bat })
        return () => {
        }
    }, [entry.totalPAYOUT, entry.totalGAMEPLAY])



    return (
        <div>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto mx-5 flex justify-between md:flex-col lg:flex-row">
                    <div>
                        <h2 className="text-2xl tracking-tight font-extrabold text-gray-900">
                            Income/Expenditure Summary
                        </h2>
                        <p>From: {new Date(filter.from * 1000).toLocaleString()}</p>
                        <p>To: {new Date(filter.to * 1000).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col space-y-2">


                    </div>
                </div>
            </div>

            <div>
                <div className="py-2 align-middle inline-block min-w-full px-5">
                    <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">


                        <h6 className="p-2 bg-gray-100 my-2">{transactions.length} Transactions Found</h6>

                        <table className=" min-w-full divide-y divide-gray-200">
                            <thead className="">
                                <tr className="font-bold">
                                    <th scope="col" className="border px-2 py-1 uppercase text-left"> Total Income from Games </th>
                                    <th scope="col" className=" border px-2 py-1 uppercase "> {entry.totalGAMEPLAY}</th>
                                </tr>
                                <tr className="font-bold">
                                    <th className="border px-2 py-1 text-left uppercase"> Total wins paid out </th>
                                    <th className=" border px-2 py-1 uppercase "> {entry.totalPAYOUT}</th>
                                </tr>
                                <tr className="font-bold">
                                    <th className="border px-2 py-1 text-left uppercase"> Tax (%)</th>
                                    <th className=" border px-2 py-1 uppercase "> {values["302"]}</th>
                                </tr>
                                <tr className="font-bold">
                                    <th className="border px-2 py-1 uppercase text-left"> Balance before tax</th>
                                    <th className=" border px-2 py-1 uppercase "> {entry.bbt}</th>
                                </tr>

                                <tr className="font-bold bg-green-100">
                                    <th className="border px-2 py-1 uppercase text-left"> Balance after tax</th>
                                    <th className=" border px-2 py-1 uppercase "> {entry.bat}</th>
                                </tr>

                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Summary;
