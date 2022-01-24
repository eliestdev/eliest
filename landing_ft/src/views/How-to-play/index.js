import Header from "../../components/Header";
import './index.css'
import Collapsible from 'react-collapsible';

const HowToPlay = () => {
    const data = [
        { name: 'Visit the EliestLotto website', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', },
        { name: 'Another instruction here', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', },
        { name: 'Another instruction here', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', },
        { name: 'Another instruction here', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliquaLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', },
    ]

    return (
        <div className="how">
            <Header />

            <div className="py-8 items-center content-center how-body">
                <div className="hp-header">How To Play The Game</div>
                <p className="hp-p">NOTE: You must be 18 years and above  </p>

                <div className="hp-p pr-6 w-full md:w-2/3">
                    <div className="text">
                        To play on a phone
                    </div>

                    <div className="text">
                        You need at least N20 naira airtime on your mobile phone
                    </div>

                    <div className="text">
                        Dial *389*801# on any network and phone to register
                    </div>

                    <div className="text">
                        Input your YEAR OF BIRTH [ example 1980] a notification confirming your registration will pop up
                    </div>

                    <div className="text">
                        When you redial the USSD code 5 options would be displayed.
                    </div>

                    <div className="text">
                        Follow the prompts that follow
                    </div>

                    <div className="text">
                        Ensure you fund your wallet by clicking on option 1.  It can be funded either via directly from a bank account or by loading a voucher purchased from an eliestlotto agent.
                    </div>

                    <div className="text">
                        Click on option two to choose from our lotto game varieties. The available game names are:
                    </div>

                    <div className="text">
                        <ul>
                            <li> Tanzanite </li>
                            <li> Alexandrite </li>
                            <li>  Jadite </li>
                            <li> Diamond </li>
                            <li> Jackpot </li>
                        </ul>
                    </div>

                    <div className="text">
                        Note: Jackpot can be played online only
                    </div>

                    <div className="text">
                        Click on option 3 to check your balance.
                    </div>

                    <div className="text">
                        Click on option 4 to transfer winnings to any bank account,POS agent or an eliestlotto agent.
                    </div>

                    <div className="text">To Play online</div>

                    <div className="text">Ensure you have registered on a phone first. Visit www.eliestlotto.biz</div>

                    <div className="text">Login with your phone number and password.</div>

                    <div className="text"> Select amount to play</div>

                    <div className="text">Choose either the lotto or scratch card game to play </div>
                    {/* {data.map((d) => (
                        <Collapsible openedClassName="collapse-text mb-3" trigger={d.name} className="border border-gray-100 rounded h-14 px-3 py-3 collapse-text mb-3">
                            <div className="border border-gray-100 rounded h-auto px-3 py-3 collapse-text mb-6">
                                {d.body}
                                <p></p>
                                {d.body}
                            </div>
                        </Collapsible>
                    ))} */}
                </div>
            </div>
        </div>
    );
}

export default HowToPlay;