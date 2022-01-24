import { ColorSwatchIcon, CreditCardIcon, GiftIcon, TicketIcon } from '@heroicons/react/outline';
import { clearErrors } from 'features/games/gameSlice';
import { showScratchModal } from 'features/games/gameSlice';
import { setSelected } from 'features/games/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import './index.css'

const ScratchCard = ({ icon }) => {
    const dispatch = useDispatch()
    const scratchCard = useSelector((state) => state.games.scratchModal);

    const handleSelectGame = () => {
        dispatch(showScratchModal(true))
    }
    return (
        <div className="h-auto game--card overflow-hidden sm:w-1/2 w-full mb-2">

            <div className="s__content flex justify-between relative px-5 py-5" onClick={() => handleSelectGame()}>

                <div className=" animate-pulse p-2 self-center font-thin">
                    <TicketIcon className="h-10 w-10" />
                </div>
                <p className="text-center self-center font-bold text-lg">Scratch and Win</p>
            </div>
        </div>
    );
}

export default ScratchCard;