import Games from '../../assets/img/lotto.png'
import Play from '../../assets/svg/Play.svg'
import Grid from '../../assets/svg/grid.svg'
import './index.css'
import GameCard from 'components/game card'
import { useDispatch, useSelector } from 'react-redux'
import Tanza from '../../assets/img/tanza.png'
import icon1 from '../../assets/img/icon1.png'
import icon2 from '../../assets/img/icon2.png'
import icon3 from '../../assets/img/icon3.png'
import icon4 from '../../assets/img/icon4.png'
import icon5 from '../../assets/img/icon5.png'
import ScratchCard from 'components/game card/scratch'
import SCard from 'components/scratch card'
import { showScratchModal } from 'features/games/gameSlice'


const AllGames = () => {
    const dispatch = useDispatch();

    const icons = [icon1, icon2, icon3, icon4, icon5]
    const games = useSelector((state) => state.games.list)
    const scratchCard = useSelector((state) => state.games.scratchModal);
    return (
        <div className="w-full sm:w-6/12 border border-gray-100 rounded-3xl px-4">
            <div className="lotto ml-2 mb-2 hidden sm:block">LOTTO</div>
            <div className="justify-center align-items-center px-6 hidden sm:inline-flex">
                <img src={Games} width="260" height="30" className="ml-10" />
                <div className="content-center items-center justify-center mx-auto ml-6">
                    <div className="game mt-1">Welcome to our game channel where everybody is a winner while having fun and earning</div>
                    {/* <p className="game--text mt-5 mb-3"></p> */}

                    {/* <div className="mt-2 flex content-center">
                        <button className="focus:outline-none bg-green-600 transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big">
                            Find Out More
                        </button>
                        <img className="ml-4 mt-4" src={Play} />
                    </div> */}
                </div>
            </div>

            <div className="flex justify-between px-5 mt-6">
                <span className="all--text">All Games</span>
                <div className="flex items-center">
                </div>
            </div>

            <div className=" mt-5 flex flex-wrap">
                <ScratchCard icon={icons[5]}/>
                {games.map((game, index) => <GameCard game={game} icon={icons[index]} />)}
            </div>
        </div>
    );
}

export default AllGames;