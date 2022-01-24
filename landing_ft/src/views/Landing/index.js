import Footer from '../../components/Footer';
import Header from '../../components/Header';
import './index.css'
import Play from '../../assets/svg/Play.svg'
import Man from '../../assets/img/man.png'
import M18 from '../../assets/img/18.png'
import Wave from '../../assets/svg/orange_waves.svg'
import land from '../../assets/svg/land.svg'
import Games from '../../assets/img/lotto.png'
import Cust from '../../assets/svg/customer.svg'
import Trans from '../../assets/svg/transparent.svg'
import Supe from '../../assets/svg/supervisor.svg'

const Landing = () => {
    return (
        <div className="landing--page">
            <Header />
            <div className="md:grid md:grid-cols-2 md:gap-6 mt-20">
                <div className="md:pl-16 pl-4">
                    <div className="play-landing--text">Play</div>
                    <div className="play-landing--wait text-red-500 px-2">Wait <span className="n">n</span> Get</div>
                    <div className="play-landing--code px-2">Dial *389*801#</div>

                    <div className="whatup mt-3 md:mt-4">
                        On any type of phone 
                        <p>to start winning</p>
                    </div>

                    <div className="py-1 sm:py-12 flex md:gap-4 gap-5 button--landing">
                        <a href="https://play.eliestlotto.biz/" className="btn-primary play focus:outline-none transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-4 text-sm mt-6">
                            Play a game
                        </a>
                        <img className="mt-5 cursor-pointer" src={Play} alt="play" />
                    </div>
                </div>
                <div className="mx-20 sm:mt-10 flex flex-col" style={{ backgroundImage: `url(${Wave})` }}>
                <img src={M18} className="h-24 self-center rounded-full" alt="man" />
                <img src={Man} className="h-auto" alt="man" />
                </div>
            </div>

            <div className="ussd mx-auto">
                <div className="py-6 md:flex justify-center mx-auto sm:py-12">
                    <div className="py-12 px-4 md:px-12 w-5/6 bg-green-600 grid grid-cols-2 space-y-5 mx-auto rounded-3xl hover:rotate-1 transition-transform">
                        <div style={{ backgroundImage: `url(${land})` }} className="px-1 md:px-20">
                            <h1 className="landing-ussd--title font-medium mb-8 ml-1 sm: ml-7">*389*801#</h1>
                            <h2 className="landing-ussd--sub font-normal text-white lg:w-2/5 sm:text-center">You can now also create an Eliest Lotto account with USSD, simply dial in these digits or sign up on website.</h2>
                        </div>
                        {/* <div className="mx-auto py-12">
                            <a href="https://agents.eliestlotto.biz/auth/register" className="py-2 sm:hidden c-btn focus:outline-none bg-white transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded text-sm text-green-500 text-center mx-auto">
                                Create account
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="mb-12 px-8 md:px-1">
                <h2 className="text-center h2 mx-auto mb-12">
                    Get access to games, and start earning instantly
                </h2>

                {/* <p className="text-center md:mt-10 mt-6 land-p mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor</p> */}
            </div>

            <div className="md:grid md:grid-cols-2 px-6 md:px-12 mb-20">
                <div className="mx-auto">
                    <img src={Games} alt="games" />
                </div>
                <div className="close--up">
                    <h3 className="check-text">Check the game varieties on our platform</h3>

                    <p className="py-6 check-p mb-6">
                        Register first by dialing *389*801# to access our games varieties which are
                        <br />
                        <div className="md:pt-3">• scratch and win</div>
                        <div>• And lottery games</div>
                    </p>

                    <div className="force pt-10">
                        <a href="https://play.eliestlotto.biz/" className="sm:text-center btn-primary focus:outline-none transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big game--btn">
                            Go to Games
                        </a>
                    </div>
                </div>
            </div>

            <div className="py-12 md:py-8 px-8 md:px-1">
                <h2 className="text-center h2 mx-auto">
                    Become a part of the EliestLotto family
                </h2>

                <p className="text-center mt-10 land-p mx-auto mb-10 md:mb-16">
                    To be a part of the wealth creation family and determine your earnings; simply register on our platform by clicking on become an agent . Determine your own targets to earn and enjoy our referral  commission earning system
                </p>

                <div className="cards py-12 md:flex mb-10">
                    <div className="flex-1 md:px-3">
                        <div className="py-2 flex md:px-8">
                            <div className="card-colored h-auto py-12 rounded-xl hover:rotate-1 transition-transform px-4 md:px-12">
                                <img src={Cust} alt="customer" />

                                <h3 className="become-agent py-8">Become an agent</h3>
                                {/* <p className="py-6 text-white p-agent px-1 mb-12 md:mb-10">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor
                                </p> */}

                                <div className="flex gap-4">
                                    <a href="https://agents.eliestlotto.biz/" className="card-btn text-green-500 focus:outline-none bg-white transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded px-8 py-3 text-sm mt-6">
                                        Become an agent
                                    </a>
                                    <img src={Trans} className="mt-6" alt="trans" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="py-2 flex md:px-2">
                            <div className="border border-gray-100 h-auto py-12 rounded-xl hover:rotate-1 transition-transform px-4 md:px-12">
                                <img src={Supe} alt="supervisor" />

                                <h3 className="become-supervisor py-8">Become a supervisor</h3>
                                {/* <p className="py-6 text-black p-agent-black px-1 mb-12 md:mb-10">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor
                                </p> */}

                                <div className="flex gap-4">
                                    <a href="https://supervisors.eliestlotto.biz/" className="card-btn-sel text-white focus:outline-none bg-green-500 transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded px-8 py-3 text-sm mt-6">
                                        Become a supervisor
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Landing;