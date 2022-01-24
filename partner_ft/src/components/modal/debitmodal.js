import { selectToken } from "features/authentication/authSlice";
import useFetch from "react-fetch-hook";
import { useSelector } from "react-redux";

const Index = ({ modal, showmodal, profile, amountToPay }) => {
    const token = useSelector(selectToken);

    const defaultWallet = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w1${profile.id}`, {
        headers: {
            "Authorization": "Bearer " + JSON.parse(token).access_token
        }
    });

    const winningWallet = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w2${profile.id}`, {
        headers: {
            "Authorization": "Bearer " + JSON.parse(token).access_token
        }
    });

    return (
        <div>
            <div className={"justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800 " + (modal == false && "hidden")}>
                <div className="md:w-80 max-w-xs rounded shadow-lg p-6  dark:bg-gray-800 bg-white">
                    <h1 className=" dark:text-gray-100 text-gray-800 font-bold text-lg">Payment Options</h1>
                    <p className="pt-6 text-xs font-semibold text-indigo-700 uppercase mb-5">
                        Select one of your wallet to be charged (₦{amountToPay})<span className="font-extrabold"> </span>
                    </p>
                    <div className=" flex items-center">
                        <div className=" dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input defaultChecked type="radio" name="radio" className="checkbox appearance-none focus:outline-none  rounded-full border-gray-400 absolute cursor-pointer w-full h-full border-4 checked:border-none" />
                            <div className="check-icon hidden border-4 border-indigo-700 flex items-center justify-center  rounded-full w-full h-full z-1">
                                <div className="bg-indigo-700 rounded-full w-2 h-2" />
                            </div>
                        </div>
                        <p className="ml-3 text-base font-medium leading-4  dark:text-gray-100 text-gray-800">  ₦{defaultWallet.data && defaultWallet.data.wallet.balance.toLocaleString('en-US', {})}, Default Wallet </p>
                    </div>
                    <div className="pb-7 pt-10 flex items-center">
                        <div className=" dark:bg-gray-800 bg-white rounded-full w-5 h-5 flex flex-shrink-0 justify-center items-center relative">
                            <input defaultChecked type="radio" name="radio" className="checkbox appearance-none focus:outline-none  rounded-full border-gray-400 absolute cursor-pointer w-full h-full border-4 checked:border-none" />
                            <div className="check-icon hidden border-4 border-indigo-700 flex items-center justify-center  rounded-full w-full h-full z-1">
                                <div className="bg-indigo-700 rounded-full w-2 h-2" />
                            </div>
                        </div>
                        <p className="ml-3 text-base font-medium leading-4  dark:text-gray-100 text-gray-800">  ₦{winningWallet.data && winningWallet.data.wallet.balance.toLocaleString('en-US', {})}, Winning Wallet</p>
                    </div>
                    <div className="flex items-center justify-between  ">
                        <button className=" py-3.5 w-full   dark:text-gray-100 text-gray-600 focus:outline-none hover:opacity-90 text-sm font-semibold border border-gray-600 rounded" onClick={() => { showmodal(!modal) }}>Dismiss</button>
                        {(winningWallet.data && defaultWallet.data) &&
                            (<div className="pl-2 w-full">
                                <button disabled={(Number(defaultWallet.data.wallet.balance) < amountToPay) && (Number(winningWallet.data.wallet.balance) < amountToPay)} onClick={() => { alert("about to pay") }} className=" py-3.5 w-full   text-white focus:outline-none hover:opacity-90 rounded border text-sm font-semibold border-indigo-700 bg-indigo-700">

                                    {(Number(defaultWallet.data.wallet.balance) < amountToPay) && (Number(winningWallet.data.wallet.balance) < amountToPay) ? "Insufficent funds" : "Confirm"}

                                </button>
                            </div>)
                        }
                    </div>
                </div>
            </div>

            <style>
                {` .checkbox:checked {
                border: none;
            }
            .checkbox:checked + .check-icon {
                display: flex;
            }`}
            </style>
        </div>)
}

export default Index;
