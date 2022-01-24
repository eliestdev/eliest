import { useEffect, useState } from "react";

function CoralPayModal({ showModal, setShowModal, profile, fundAccountWithCode }) {
  const [genCode, setgenCode] = useState("");  
  const [bank, setBank] = useState("");
  const [fundAmt, setFundAmt] = useState(100);

 

  useEffect(() => {
    setgenCode("*" + bank + "*000*950+" + profile.refcode + "+" + fundAmt + "#");
  }, [fundAmt]);

  useEffect(() => {
    setgenCode("*" + bank + "*000*950+" + profile.refcode + "+" + fundAmt + "#");
  }, [bank]);

  return (
    <>
      {showModal ? (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800">
          <div className="relative w-auto my-3 mx-auto max-w-2xl">
            <div className="border-0 rounded-md shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*body*/}
              <div className="relative p-3 flex-auto">
                <h4>Fund With Bank Account</h4>
                <small>To use USSD transfer code, please register with your bank.</small>
                <form class="my-1 space-y-1" action="#" method="POST">
                  <div class="rounded-md shadow-sm space-y-2">
                  <label for="state" class="block text-sm font-bold">
                        Enter amount to fund
                      </label>
                  <input
                      onChange={(e) => {
                        setFundAmt(e.target.value);
                      }}
                      placeholder="Amount"
                      value={fundAmt}
                      className="border border-gray-300 dark:border-gray-700 pl-3 py-2 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-500 dark:text-gray-400 "
                    />
                    <div class="space-y-1">
                      <label for="state" class="block text-sm font-bold">
                        Bank name
                      </label>
                      <select
                        name="bank"
                        id="state"
                        required
                        onChange={(e) => setBank(e.target.value)}
                        class="mt-1 block w-full py-3 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option disabled selected>
                          --Select Bank--
                        </option>
                        <option value="901">Access Bank</option>
                        <option value="901">Ecobank</option>
                        <option value="770">Fidelity Bank</option>
                        <option value="894">First Bank</option>
                        <option value="389*214">
                          First City Monument Bank (FCMB)
                        </option>
                        <option value="737">Guaranty Trust Bank (GTB)</option>
                        <option value="322*00">Heritage Bank</option>
                        <option value="7111">Keystone Bank</option>
                        <option value="providus">Providus Bank</option>
                        <option value="833">Stanbic IBTC Bank</option>
                        <option value="standard">
                          Standard Chartered Bank
                        </option>
                        <option value="822">Sterling Bank</option>
                        <option value="826">Union Bank</option>
                        <option value="919">
                          United Bank for Africa (UBA)
                        </option>
                        <option value="7799">Unity Bank</option>
                        <option value="945">Wema Bank</option>
                        <option value="966">Zenith Bank</option>
                      </select>
                    </div>

                    <div className="w-full  bg-gray-100 rounded-lg flex items-center justify-between p-4 mt-5">
                      <p className="text-base font-medium leading-6  dark:text-gray-100 text-gray-800 ">
                        {genCode}
                      </p>
                    </div>
                  </div>
                </form>
                <br />
              

                <div className="flex items-center justify-center p-2 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default CoralPayModal;
