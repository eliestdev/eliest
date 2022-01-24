import PlayHeader from "components/header/Play";
import './index.css'
import Play from '../../assets/svg/Play.svg'
import Man from '../../assets/img/man.png'
import Wave from '../../assets/svg/orange_waves.svg'
import land from '../../assets/svg/land.svg'
import Games from '../../assets/img/lotto.png'
import Cust from '../../assets/svg/customer.svg'
import Trans from '../../assets/svg/transparent.svg'
import Supe from '../../assets/svg/supervisor.svg'
import Footer from '../../components/footer'

const Landing = () => {
    return (
        <>
            <div className="landing--page">
                <PlayHeader />

                <div className="md:grid md:grid-cols-2 md:gap-6 mt-20">
                    <div className="md:pl-16 sm:pl-10">
                        <div className="play-landing--text">Play</div>
                        <div className="play-landing--wait text-red-500">Wait n get</div>
                        <div className="play-landing--code">Dial *389*801#</div>
                        <p className="landing--paragraph mt-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                        </p>

                        <div className="flex md:gap-4 gap-5">
                            <button className="btn-primary focus:outline-none transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big">
                                Play a game
                            </button>
                            <img className="mt-5 cursor-pointer" src={Play} />
                        </div>
                    </div>
                    <div className="mx-20 sm:mt-10" style={{ backgroundImage: `url(${Wave})` }}>
                        <img src={Man} className="h-auto" />
                    </div>
                </div>
            </div>

            <div className="ussd mx-auto">
                <div className="py-6 flex justify-center mx-auto sm:py-12">
                    <div className="py-12 px-12 w-5/6 bg-green-600 grid grid-cols-2 space-y-5 mx-auto rounded-3xl hover:rotate-1 transition-transform">
                        <div style={{ backgroundImage: `url(${land})` }} className="px-20">
                            <h1 className="landing-ussd--title font-medium tracking-wide mb-8">*389*801#</h1>
                            <h2 className="landing-ussd--sub font-normal tracking-wide text-2xl text-white lg:w-2/5">You can now also create an Eliest Lotto account with USSD, simply dial in these digits or sign up on website.</h2>
                        </div>
                        <div className="mx-auto py-12">
                            <button className="c-btn focus:outline-none bg-white transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded text-sm text-green-500 text-center mx-auto">
                                Create account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-center h2 mx-auto">
                    Get access to games, and start earning instantly
                </h2>

                <p className="text-center mt-10 land-p mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor</p>
            </div>

            <div className="md:grid md:grid-cols-2 px-12 mb-20">
                <div className="mx-auto">
                    <img src={Games} />
                </div>
                <div className="close--up">
                    <h3 className="check-text">Check the game varieties on our platform</h3>

                    <p className="py-6 check-p mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

                    <button className="sm:text-center sm:mx-auto items-center btn-primary focus:outline-none transition duration-150 ease-in-out hover:bg-green-500 rounded text-white px-8 py-3 text-sm mt-6 btn--big">
                        Go to Games
                    </button>
                </div>
            </div>

            <div className="py-12">
                <h2 className="text-center h2 mx-auto">
                    Become a part of the EliestLotto family
                </h2>

                <p className="text-center mt-10 land-p mx-auto">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor</p>

                <div className="cards py-12 md:flex mb-10">
                    <div className="flex-1 px-3">
                        <div className="py-2 flex px-8">
                            <div className="card-colored h-auto py-12 rounded-xl hover:rotate-1 transition-transform px-12">
                                <img src={Cust} />

                                <h3 className="become-agent py-8">Become an agent</h3>
                                <p className="py-6 text-white p-agent px-1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor
                                </p>

                                <div className="flex py-6 gap-4">
                                    <button className="card-btn text-green-500 focus:outline-none bg-white transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded px-8 py-3 text-sm mt-6">
                                        Become an agent
                                    </button>
                                    <img src={Trans} className="mt-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="py-2 flex px-2">
                            <div className="border border-gray-100 h-auto py-12 rounded-xl hover:rotate-1 transition-transform px-12">
                                <img src={Supe} />

                                <h3 className="become-supervisor py-8">Become a supervisor</h3>
                                <p className="py-6 text-black p-agent-black px-1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolor
                                </p>

                                <div className="flex py-6 gap-4">
                                    <button className="card-btn-sel text-white focus:outline-none bg-green-500 transition duration-150 ease-in-out hover:bg-green-500 hover:text-white rounded px-8 py-3 text-sm mt-6">
                                        Become a supervisor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Landing;