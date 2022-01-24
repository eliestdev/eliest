import { data } from "autoprefixer";
import { selectToken } from "features/authentication/authSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBatches } from "./api";

function VoucherBatches({ profile }) {
  const token = useSelector(selectToken);

  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState([]);


  let getVoucherBatches = async () => {
    setIsLoading(true)
    try {
      let response = await getBatches()
      if (response.status !== "SUCCESS") {
      } else {
        setBatches(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getVoucherBatches()
    return () => { };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-between w-full">
        <div className="flex flex-col w-full items-start lg:items-center rounded my-3">
          <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto my-2">
            <h3 class="text-2xl sm:text-3xl md:text-2xl font-bold leading-tight">Generated Voucher set</h3>
          </div>
          <table class="w-2/3 lg:w-2/3 divide-y divide-gray-200 mx-auto">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Date </th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vouchers Within</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"> Action(s){" "}  </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {batches.map(batch => <VoucherBatchItem
                key={batch.id}
                count={batch.vs.length}
                date={batch.id}
                data={batch.vs}
              />)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


function VoucherBatchItem({ count, date, data }) {

  const [viewer, setViewer] = useState(false);


  return (
    <tr>
      <td class="px-3 py-2 whitespace-nowrap">
        <span class=" inline-flex text-center leading-5 font-base text-sm ">
          {new Date(Number(date) * 1000).toDateString()}
        </span>
      </td>
      <td class="px-3 py-2 text-center whitespace-nowrap">
        <span class="px-2 inline-flex text-center leading-5 font-base  ">
          {count}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-4">
        <a onClick={() => { setViewer(!viewer);  /**  setBatch(_key); */ }} class="cursor-pointer text-gray-200 rounded text-xs shadow bg-gray-700 py-1 px-3">
          View
        </a>
      </td>

      <VoucherViewer modal={viewer} showModal={setViewer} vouchers={[...data]} />
    </tr>
  )
}

export default VoucherBatches;

const VoucherViewer = ({ vouchers, modal, showModal }) => {

  useEffect(() => {
    sessionStorage.setItem("c_vouchers", JSON.stringify(vouchers))
    return () => { };
  }, [modal]);

  return (
    <div className={"justify-center  flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800 " + (modal == false && "hidden")} >
      <div className="md:w-2/3 rounded shadow-lg p-6  bg-gray-100 overflow-y-auto mt-20">

        <h1 className="  text-gray-800 font-bold text-sm mb-2">
          Stored vouchers from set {vouchers[0].batch}
        </h1>
        <p className="text-sm text-gray-600 mb-5">You can copy the codes or generate a print out</p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {vouchers.map((item) => (
            <div className="rounded">
              <div className="w-full flex flex-col justify-between  bg-white   border border-gray-200 mb-2 py-2 px-4">
                <div>
                  <h6 className="text-gray-800  font-bold text-sm">
                    Amount:  ₦{item.amount}
                  </h6>
                  <p className="text-gray-800 ">
                    Code:  {item.code}
                  </p>
                  <p className="text-gray-800  text-xs ">
                    Serial:  {item.batch.split('-')[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sm:flex items-center justify-between pt-3">
          <button className="py-3.5 w-full  dark:text-gray-100 text-gray-600 leading-3 focus:outline-none hover:opacity-90 text-sm font-semibold border-gray-600 rounded  border" onClick={() => showModal(!modal)}>Dismiss</button>
          <Link to="/agent/voucher_print" className="py-3.5 w-full sm:mt-0 mt-2 sm:ml-2 leading-3 text-white focus:outline-none hover:opacity-90 text-sm font-semibold border rounded border-indigo-700 bg-indigo-700 text-center">Print</Link>
        </div>
      </div>
    </div>
  );
};


