import { useState } from "react";

 function CoralPayModal({ showModal, setShowModal , profile}) {
    const [genCode, setgenCode] = useState("");
 
 
    let getCode=(bank)=>{
      setgenCode("*" +bank + "*000*950+" + profile.refcode + "+2500#")
 
    }
 
    return (
    <>
        {showModal ? (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-800">
              <div className="relative w-auto my-3 mx-auto max-w-2xl">
                <div className="border-0 rounded-md shadow-md relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-3 border-b border-solid border-gray-200 rounded-t">
                    <h6 className="text-base font-bold"> Generate USSD to fund your account </h6>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-3 w-3 text-2xl block outline-none focus:outline-none">
                        {" "}
                        ×{" "}
                      </span>{" "}
                    </button>
                  </div>{" "}
                  {/*body*/}
                  <div className="relative p-3 flex-auto">
                    <form class="my-1 space-y-1" action="#" method="POST">
                      <div class="rounded-md shadow-sm space-y-2">
                        <div class="space-y-1">
                          <label for="state" class="block text-sm font-bold">
                            Bank name
                          </label>
                          <select
                            name="bank"
                            id="state"
                            required
                            onChange={(e)=> getCode(e.target.value)}
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
                            <option value="966">Zenith Bank</option></select>
                        </div>
 
                        <div className="w-full  bg-gray-100 rounded-lg flex items-center justify-between p-4 mt-5">
                          <p className="text-base font-medium leading-6  dark:text-gray-100 text-gray-800 ">
                            {genCode}
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="flex items-center justify-center p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close{" "}
                    </button>
                  </div>
                  </div>
                  </div>
                  </div>
        ):
         (<></>)
        }
    </>
    )}
 
    export default CoralPayModal