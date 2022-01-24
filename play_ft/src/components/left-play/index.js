import Small from '../../assets/img/logo.png'
import ellipsedRectangle from '../../assets/svg/Subtract.svg'
import wave from '../../assets/img/wave.png'
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, setTransferModal } from 'features/games/gameSlice';
import FundAlert from './overlay';
import TfModal from '../../ui/modal/transferWinnings'
import { toggleFundModal } from 'features/authentication/authSlice';

const LeftPlay = () => {
    const selected = useSelector((state) => state.games.selected) || {}
    const games = useSelector((state) => state.games.list)
    const profile = useSelector((state) => state.auth.profile)
    const fundModal = useSelector((state) => state.auth.fundModal)

    const tfModal = useSelector((state) => state.games.transferModal)

    const dispatch = useDispatch()

    const handleSelectGame = (data) => {
        dispatch(setSelected(data))
    }
    const handleOpenFundAlert = () => {
        dispatch(toggleFundModal())
    }

    return (
        <div className="w-full sm:w-3/12 border border-gray-100 px-3 py-6 rounded-3xl">
            <div className="py-2 flex flex-col justify-center mx-auto">
                <div className="h-auto py-10 bg-green-800 rounded-2xl hover:rotate-1 transition-transform " style={{ backgroundImage: `url(${wave})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>

                    {profile != null && profile && <div className="w-full text-gray-800 rounded-lg opacity-80 space-y-2">
                        <div className="bg-gray-50 px-2 ">
                            <span className="text-gray-800">Wallet Balance</span>
                            <div className="sm:py-1  mb-1 relative">
                                <span className="text-xl sm:text-lg font-bold">₦{Number(profile.balance).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-2">
                            <span className="text-gray-800">Winnings Balance</span>
                            <div className="py-1 sm:py-1  mb-1 relative">
                                <span className="text-xl sm:text-lg font-bold">₦{Number(profile.wins).toFixed(2)}</span>
                            </div>
                        </div>
                    </div> }
                </div>

                <div className=" mt-5 space-y-2">
                        <button className="py-2 px-6 text-green-500 content-center border-2 w-full rounded-2xl focus:outline-none hover:bg-gray-800 hover:text-gray-100" onClick={() => dispatch(setTransferModal(true))}>Transfer winnings</button>
                        <button className="py-2 px-6 text-green-500 border-2 w-full rounded-2xl focus:outline-none hover:bg-gray-800 hover:text-gray-100" onClick={() => handleOpenFundAlert()}>Fund wallet</button>
                    </div>
            </div>

            <div className="mt-6 h-auto py-6 pl-4 hidden sm:block" style={{ backgroundImage: `url(${ellipsedRectangle})` }}>
                <div className="amount--text">Select amount</div>
                <p className="amount--subtext pt-2">This would be the amount you would be playing with</p>

                <div className="py-6">
                    {games.map((game) => {
                        return <div>
                            <label className="inline-flex items-center mb-4">
                                <input type="radio" className="form-radio" name="radio" value="1" checked={selected.id === game.id} onClick={() => handleSelectGame(game)} />
                                <span className="ml-4 label--amount">N{game.cost}</span>
                            </label>
                        </div>
                    })}
                </div>
            </div>
            <FundAlert open={fundModal} />
            <TfModal open={tfModal} setOpen={setTransferModal} profile={profile} />
        </div>
    )
}

export default LeftPlay;