import Table from "components/table/table";
import DownTime from "./downline";
import DownLineModal from "./modal/downlineModal";
import GetVoucher from "./modal/getVoucher";
import TopUp from "./modal/topup";

const Voucher = () => {
    return (
        <div>
            {/* <TopUp active={true} /> */}
            {/* <GetVoucher active={true} /> */}
            {/* <DownTime /> */}
            {/* <DownLineModal active={true} /> */}
            <Table />
        </div>
    );    
}

export default Voucher;