import { selectToken } from "features/authentication/authSlice";
import useFetch from "react-fetch-hook";
import { useSelector } from "react-redux";



function WalletTransactions({profile}) {
    const token = useSelector(selectToken);

    const { isLoading, data, error } = useFetch(`${process.env.REACT_APP_ENDPOINT_URL}agent/transactions/w1${profile.id}`, {
        headers:{
            "Authorization": "Bearer " + JSON.parse(token).access_token
        }
    });

    if(error){
      alert(error)
    }

   
    return (
      <>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mt-5">
          <div className="flex justify-center py-2 align-middle sm:px-6 lg:px-8 mx-auto">
            <div className=" shadow overflow-hidden border-b border-gray-200  mx-auto">
              <table className="w-2/3 lg:w-1/2 divide-y divide-gray-200 mx-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title{" "}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount{" "}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reference{" "}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type{" "}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date{" "}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {(data  && ( data.transactions&&
                    
                    data.transactions.map((item) => (
                        <TransactionItem
                        title={item.description}
                        channel={item.channel}
                        date={new Date(item.created_at * 1000).toLocaleString("en-US")}
                        amount={item.amount}
                        type={item.class}
                        tref={item.t_ref}
                      />
                       ))
                       
                       )
                      
                    )}
            
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  function TransactionItem({ title, channel, amount, type, date, tref }) {
    return (
      <>
        <tr>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex h-10 w-10 center flex-center justify-center align-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 center self-center"
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
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{title} </div>
                <div className="text-sm text-gray-500">with {channel} </div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">₦{amount}</div>
          </td>

          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">#{tref}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {type}{" "}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {date}{" "}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="#" className="text-indigo-600 hover:text-indigo-900">
            </a>
          </td>
        </tr>
      </>
    );
  }
  

  export default WalletTransactions;
