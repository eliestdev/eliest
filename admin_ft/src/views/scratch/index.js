import { HttpPost, HttpGet } from '../../endpoint'
import { useState, useEffect } from 'react'

const ScratchPage = () => {
    const end = process.env.REACT_APP_ADMIN_ENDPOINT;
    const [denominations, setDenomination] = useState(null)
    const [newAmount, setNewAmount] = useState({
        amount: 0,
        count: 0,
        won: 0
    })

    const [iAmount, setIAmount] = useState({
        amount: 0,
        count: 0,
        won: 0
    })

    const updateField = (e) => {
        setIAmount({
            ...iAmount,
            [e.target.name]: e.target.value,
        });
    };

    const add = async () => {
        const size = denominations === null ? 1 : denominations.length + 1
        const data = await HttpPost(`${end}v1/scratch/addPlayDenominations`, { id: size.toString(), amount: Number(iAmount.amount), won: Number(iAmount.won), count: Number(iAmount.count) })
        setDenomination(data.data);
    }

    const get = async () => {
        var a = await HttpGet(`${end}v1/scratch/getPlayDenominations`)
        console.log(a)
        setDenomination(a.data);
    }

    const deleteAmount = async (id) => {
        var a = await HttpGet(`${end}v1/scratch/delete/${id}`)
        setDenomination(a.data);
    }

    const update = async (id) => {
        var a = await HttpPost(`${end}v1/scratch/updatePlayDenominations`, { id, amount: Number(newAmount.amount), won: Number(newAmount.won), count: Number(newAmount.count) })
        setDenomination(a.data);
    }

    useEffect(() => get(), [])

    const changeInput = (e) => {
        setNewAmount({
            ...newAmount,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <div className="font-semibold text-2xl">
                Scratch &amp; Play Denominations
            </div>

            <div className="flex w-full">
                <div className="justify-between text-center w-full py-6 items-center content-center">
                    {denominations === null && <div className="text-center text-xl">
                        No denominations have been setup on the Scratch & Play
                    </div>}

                    <div className="flex py-4 gap-4 justify-start">
                        <input onChange={updateField} name="amount" type="number" placeholder="Amount" className="px-3 bg-gray-100 rounded border border-gray-200 w-1/6" />
                        <input onChange={updateField} name="count" type="number" placeholder="Winning Count" className="px-3 bg-gray-100 rounded border border-gray-200 w-1/6" />
                        <input onChange={updateField} name="won" type="number" placeholder="Amount Won" className="px-3 bg-gray-100 rounded border border-gray-200 w-1/6" />

                        <button className="px-6 py-2 bg-black rounded text-white" onClick={add}>Add</button>
                    </div>
                </div>
            </div>

            {denominations && <div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className="font-bold bg-gray-800 text-gray-100">
                            <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider">Winning Count</th>
                            <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider">Amount Won</th>
                            <th scope="col" className="px-6 py-3 text-left uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">

                    </tbody>
                    {denominations.map((deno, index) => (
                        <tr key={deno.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{deno.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                 {/* Winning Count */}
                                 <input name="amount" placeholder={deno.amount} onChange={(e) => changeInput(e)} className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Winning Count */}
                                <input name="count" placeholder={deno.count} onChange={(e) => changeInput(e)} className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {/* Amount Won */}
                                <input name="won" placeholder={deno.won} onChange={(e) => changeInput(e)} className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400" />
                            </td>
                            <td className="gap-3 items-center content-center">
                                <button className="hover:bg-black py-1 px-5 rounded hover:text-white" onClick={(e) => update(deno.id)}>Save Changes</button>
                                <button className="hover:bg-red-500 text-red-500 py-1 px-5 rounded hover:text-white" onClick={() => deleteAmount(deno.id)}>Reset Games</button>
                            </td>
                        </tr>
                    ))}
                </table>
            </div>
            }
        </>
    );
}

export default ScratchPage;