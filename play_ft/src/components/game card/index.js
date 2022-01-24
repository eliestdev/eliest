import { clearErrors } from 'features/games/gameSlice';
import { setSelected } from 'features/games/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import './index.css'

const GameCard = ({game, icon}) => {
    const dispatch = useDispatch()
    const selected = useSelector((state) => state.games.selected) || {}
    const handleSelectGame =()=>{
        dispatch(clearErrors())
        dispatch(setSelected(game))
    }
    return (
        <div className="h-auto game--card overflow-hidden md:w-1/2 sm:w-full">
            <div className="flex relative bg-gray-100 rounded-xl m-2" onClick={()=> handleSelectGame()}>
                <div className="md:flex-shrink-0 py-8 ml-6">
                    <img className="h-20 object-cover md:h-20 md:w-20 icon mt-1" src={icon} alt="Tanza" />
                </div>
                <div className="p-5">
                    <div className="tracking-wide text-sm desc">{game.test} </div>
                    <p className={"mt-2 " + (selected.id === game.id ? " win--amount--sel" : " win--amount")}>₦{game.cut}</p>
                </div>
                <div className={"play--btn right-0 absolute " + (selected.id === game.id ? " bg-green-600 ":"  " )}>
                    <div className="play--text items-center justify-center content-center mx-auto mt-12 hover:pointer">Play</div>
                </div>
            </div>
        </div>
    );
}

export default GameCard;