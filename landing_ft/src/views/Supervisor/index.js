import Header from "../../components/Header";
import '../How-to-play/index.css'

const Index = () => {
    return (
        <div className="how">
            <Header />

            <div className="py-8 items-center content-center how-body">
                <div className="hp-header">To become a supervisor</div>

                <div className="hp-p pr-6 w-full md:w-2/3">
                    <div className="text">
                    Register on www.eliestlotto.biz 
                    </div>

                    <div className="text">
                    By default upon registration, you are a recruiting supervisor.
                    </div>

                    <div className="text">
                    All paying supervisors would be assigned agents, while recruiting supervisors will need to meet the requirements.

                    </div>

                    <div className="text">
                    Activate your account with the required sum
                    </div>

                    <div className="text">
                    Monitor your agents
                    </div>

                    <div className="text">
                    Check your profile for referral code 
                    </div>

                    <div className="text">
                    You can add agents too
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index;