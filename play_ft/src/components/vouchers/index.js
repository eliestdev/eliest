import './index.css'
import ellipsedRectangle from '../../assets/svg/Subtract.svg'
import { useSelector, useDispatch } from 'react-redux';
import { setGuess } from 'features/games/gameSlice';
import { setGameModal } from 'features/games/gameSlice';
import { toggleGameModal } from 'features/games/gameSlice';
import { addError } from 'features/games/gameSlice';
import { discardGuess } from 'features/games/gameSlice';

const Vouchers = () => {
    const dispatch = useDispatch()
    const numbers = Array(90).fill(null);
    const guess = useSelector((state) => state.games.guess)
    const selected = useSelector((state) => state.games.selected)

    const handleSetGuess = (i) => {
        const guess = i + 1
        if (!selected)
            dispatch(addError("Choose one of the game to play"))
        else
            dispatch(setGuess(guess))
    }

    const handleGamePrompt = () => {
        if (guess.includes(0) || guess[0] === guess[1])
            dispatch(addError("Choose a game to play and select two different numbers"))
        else
            dispatch(toggleGameModal())
    }
    const handleGuessDiscard = () => {

        dispatch(discardGuess())
    }

    return (
        <div className="w-full sm:w-3/12 border border-gray-100 px-3 py-6 rounded-3xl">
            <div className="w-full">
                <span className="vouch">Select 2 lucky number to win</span>
              
                <div className="pt-4 ml-1 justify-center items-center grid grid-cols-5 gap-3">
                    {guess.map(value =>
                        <span className="bg-green-500 rounded-full flex items-center justify-center px-2 py-2 text-white">{value}</span>
                    )}
                </div>

                <div style={{ backgroundImage: `url(${ellipsedRectangle})` }} className="mt-6 mb-6 px-4 h-auto">
                    <div className="grid grid-cols-10 gap-2 py-4">
                        {numbers.map((n, i) => {
                            return <span className="bg-gray-200 rounded-full flex items-center justify-center px-2 cursor-pointer" onClick={() => handleSetGuess(i)}>{i + 1}</span>
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button class="tbutton bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded" onClick={() => handleGuessDiscard()}>
                        Dismiss
                    </button>
                    <button className="tbutton bg-green-500 hover:bg-green-500 text-white font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded" onClick={() => handleGamePrompt()}>
                        Play game
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Vouchers;