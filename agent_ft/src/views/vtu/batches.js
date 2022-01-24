import { selectToken } from "features/authentication/authSlice";
import { useEffect, useState } from "react";
import useFetch from "react-fetch-hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function VoucherBatches({ profile }) {
  const token = useSelector(selectToken);

  const { isLoading, data, error } = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/voucher/batches`,
    {
      headers: {
        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    }
  );
  return (
    <>
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
        <div class="flex justify-center py-2 align-middle sm:px-6 lg:px-8 w-full mx-auto">
          <div class="  overflow-auto border-b border-gray-200 w-full   mx-auto">
            <table class="w-2/3 lg:w-2/3 divide-y divide-gray-200 mx-auto">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Batch ID{" "}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount{" "}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Count{" "}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date{" "}
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action(s){" "}
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                {data &&
                  data.map((item) => (
                    <TransactionItem
                      title={item.id}
                      amount={ item.vs.length > 0 ? item.vs[0].amount : 0}
                      count={item.vs.length}
                      _key={item.key}
                      date={item.vs.length > 0 ? item.vs[0].created_at:0}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function TransactionItem({ title, amount, count, date, type, _key }) {
  const [co, setCo] = useState(false);
  const token = useSelector(selectToken);

  const [batch, setBatch] = useState(null);

  const { isLoading, data, error } = useFetch(
    `${process.env.REACT_APP_ENDPOINT_URL}agent/batch/vouchers/${batch}`,
    {
      depends: [batch],
      headers: {
        Authorization: "Bearer " + JSON.parse(token).access_token,
      },
    }
  );

  useEffect(() => {
    sessionStorage.setItem("c_vouchers", JSON.stringify(data))
    return () => {
      
    };
  }, [data]);

  return (
    <>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex h-10 w-10 center flex-center justify-center align-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 center self-center"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>{" "}
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{title} </div>
              <div class="text-sm text-gray-500">Value: ₦{amount} </div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">
            {amount} 
          </div>
        </td>
       
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {count}{" "}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 inline-flex text-center leading-5 font-semibold  ">
            {new Date(Number(date) * 1000).toDateString()}{" "}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
          <a
            onClick={() => {
              setCo(!co);
              setBatch(_key);
            }}
            class="text-gray-200 rounded hover:text-indigo-900 shadow bg-gray-700 py-1 px-3"
          >
            View
          </a>
         
        </td>
      </tr>
      <VoucherCos modal={co} showModal={setCo} vouchers={data ? data : [{amount:100, batch:"-"}]} />
    </>
  );
}

export default VoucherBatches;
const VoucherCos = ({ vouchers, modal, showModal }) => {
  return (
    <div
      className={
        "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800 " +
        (modal == false && "hidden")
      }
    >
      <div className="md:w-2/3 rounded shadow-lg p-6  bg-gray-100 ">
        <h1 className="  dark:text-gray-100 text-gray-800 font-bold text-lg mb-2">
          Stored vouchers
        </h1>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {vouchers.map((item)=>(
             <div className="rounded">
             <div className="w-full  flex flex-col justify-between dark:bg-gray-800 bg-white dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4">
               <div>
                 <h4 className="text-gray-800 dark:text-gray-100 font-bold my-1">
                   Amount:  {item.amount}
                 </h4>
                 <h4 className="text-gray-800 dark:text-gray-100 font-bold my-1">
                   Code:  {item.code}
                 </h4>
                 <h4 className="text-gray-800 dark:text-gray-100 font-bold my-1">
                    Serial:  {item.batch.split('-')[0]}
                 </h4>
               </div>
             </div>
           </div>
        ))}
        </div>
        <div className="sm:flex items-center justify-between pt-6">
                <button className="py-3.5 w-full  dark:text-gray-100 text-gray-600 leading-3 focus:outline-none hover:opacity-90 text-sm font-semibold border-gray-600 rounded  border" onClick={()=>showModal(!modal)}>Dismiss</button>
                <Link to="/agent/voucher_print" className="py-3.5 w-full sm:mt-0 mt-2 sm:ml-2 leading-3 text-white focus:outline-none hover:opacity-90 text-sm font-semibold border rounded border-indigo-700 bg-indigo-700 text-center">Print</Link>
            </div>
      </div>
    </div>
  );
};
