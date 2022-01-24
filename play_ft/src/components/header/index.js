// import TButton from "components/button";
import Logo from '../../assets/img/logo.png'
import './index.css'

const Header = () => {
    return (
        <>
            {/* <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 place-items-start pt-5">
            <span>aa</span>
            <span>im</span>
            
            <span>
                <TButton text="Become a supervisor"/>
                <TButton text="Become an Agent"/>
            </span>
        </div> */}

            <div className="md:flex md:justify-between md:gap-5 md:px-6 md:place-items-start pt-5">
                <div className="sm:hidden md:grid">
                    <img src={Logo} className="h-20 md:h-24 md:w-40 im mx-auto"/>
                </div>
                <div className="flex justify-between mt-3 gap-2 md:gap-3 px-2">
                    <a className="items-center content-center text-center bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded" href="https://www.eliestlotto.biz/">Home</a>
                    <a className="hide items-center content-center text-center bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded" href="https://www.eliestlotto.biz/how">
                        How to become a Player
                    </a>
                    <a className="items-center content-center text-center bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded" href="https://supervisors.eliestlotto.biz/">
                        Become a supervisor
                    </a>
                    <a className="items-center content-center text-center sm:bg-green-500 md:bg-transparent hover:bg-green-600 text-green-700 font-semibold hover:text-white py-2 px-4 hover:border-transparent rounded" href="https://agents.eliestlotto.biz/">
                        Become an agent
                    </a>
                </div>
            </div>
        </>
    );
}

export default Header;