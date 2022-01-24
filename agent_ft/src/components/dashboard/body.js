import DashboardHeader from "./header";
import Add from '../../assets/svg/add.svg'
import Send from '../../assets/svg/send.svg'
import Transfer from '../../assets/svg/transfer.svg'
import Recharge from '../../assets/svg/recharge.svg'
import FundModal from '../../components/dialog/fund'
import { useState } from "react";
import WithdrawModal from "components/dialog/withdrawal";
import TransferAgent from "components/dialog/transferAgent";
import Recharged from "components/dialog/recharge";
import ActivateFailure from "components/dialog/activate_failure";
import ActivateSuccess from "components/dialog/activated_success";
import { useDispatch, useSelector } from "react-redux";
import { setShowProfile } from "features/authentication/authSlice";
import Wallet from "./wallet";
import Target from "components/dialog/target";
import { useHistory } from 'react-router-dom'

const DashboardBody = () => {
    const history = useHistory()
    const [fund, setFund] = useState(false);
    const [withdrawal, setWithdraw] = useState(false);
    const [transfer, setTransfer] = useState(false);
    const [recharge, setRecharge] = useState(false);
    const [target, setTarget] = useState(false);
    let showProfile = useSelector((state) => state.auth.showProfile);
    const wallets = useSelector((state) => state.auth.wallets);
    let profile = useSelector((state) => state.auth.profile);
    
    const options = [
        { name: 'Fund wallet', icon: Add, action: () => setFund(true) },
        { name: 'Withdraw', icon: Send, action: () => setWithdraw(true) },
        { name: 'Recharge agent', icon: Transfer, action: () => setTransfer(true) },
        { name: 'Recharge player', icon: Recharge, action: () => setRecharge(true) },
        { name: 'Set Target', icon: Recharge, action: () => setTarget(true) },
        { name: 'View Targets', icon: Transfer, action: () => history.push('/agent/targets')}
    ]
    const dispatch = useDispatch()
    const setProfile = () => {
        dispatch(setShowProfile(!showProfile))
    }

    return (
        <div className="w-full flex flex-col">
            <DashboardHeader />
            <div className="-mt-10 w-full sm:w-1/2 sm:self-center px-5 sm:px-0">
                <div className="bg-white rounded-xl  py-6 w-full flex justify-evenly  border-0 border-gray-100">
                    {options.map((option) => (
                        <div className="cursor-pointer  text-center flex flex-col" onClick={() => option.action()}>
                            <img src={option.icon} className="w-10 sm:w-13 h-10 sm:h-13 self-center" />
                            <div className="py-4 option-name">{option.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col w-full pb-10">
                <div className="flex flex-col sm:flex-row justify-evenly p-10 gap-5">

                    {wallets.map((wallet, index) => (<div className="flex justify-center flex-1 ">
                        <Wallet wallet={wallet} index={index} />
                    </div>
                    ))}
                </div>
            </div>


            <FundModal open={fund} setOpen={setFund} />
            <WithdrawModal open={withdrawal} setOpen={setWithdraw} />
            <TransferAgent open={transfer} setOpen={setTransfer} />
            <Recharged open={recharge} setOpen={setRecharge} />
            <Target open={target} setOpen={setTarget} />
            <ActivateFailure visible={false} />
            <ActivateSuccess visible={false} />
        </div>
    );
}

export default DashboardBody;