import Header from "../../components/Header";
import '../How-to-play/index.css'

const Index = () => {
    return (
        <div className="how">
            <Header />

            <div className="py-8 items-center content-center how-body">
                <div className="hp-header">To become An Agent you need:</div>

                <div className="hp-p pr-6 w-full md:w-2/3">
                    <div className="text">
                        An internet connected device as you can only be registered as an agent online.
                    </div>

                    <div className="text">
                        Bank account
                    </div>

                    <div className="text">
                        Register on our website www.eliestlotto.biz
                    </div>

                    <div className="text">
                        Fund your wallet with #1,000 ( #500 would be used to activate your agent account.).
                    </div>

                    <div className="text">
                    Use your referral code to refer agents and enjoy our multi ways of earning on our agents platform. The following are found on agent page 
                    </div>

                    <div className="text">
                    Play: Agent can play for both player 

                    </div>

                    <div className="text">
                    Wallet: It shows both fund and wining wallet balance
                    </div>

                    <div className="text">
                    Recharge a player by inputting his phone number and amount
                    </div>

                    <div className="text">
                    Transfer to another agent by inputting his phone number and amount
                    </div>

                    <div className="text">
                    Target: set your monthly target here
                    </div>

                    <div className="text">
                    New Voucher:  Generate vouchers to sell to players
                    </div>

                    <div className="text">
                    Voucher Batches: All generated vouchers are stored here. 
                    </div>

                    <div className="text">Downlines: All referred agents are stored here. </div>

                    <div className="text">Profile : Contains all relevant information and your referral code.</div>

                    <div className="text">Target: Set target progress can be monitored here. </div>
                </div>
            </div>
        </div>
    )
}

export default Index;