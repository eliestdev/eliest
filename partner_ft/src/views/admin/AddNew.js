import React, { useState } from 'react';
import { addAdmin } from './api';

const AddNew = () => {
    const [newAdmin, setNewAdmin] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    let AddAdmin = async () => {
        setIsLoading(true)
        try {
          let response = await addAdmin(newAdmin)
          if (response.status !== "SUCCESS") {
          } else {
            window.location.reload();
          }
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      };


    return (
        <div className="my-5 shadow">
            <div className="px-4 py-5 bg-white sm:p-6">
                <h3>Add New Admin</h3>
                <hr />
                <br />
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700"> Name   </label>
                        <input type="text" name="name"
                            onChange={(e) => {
                                setNewAdmin({ ...newAdmin, name: e.target.value });
                            }} className="w-full border  p-1 text-sm" />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700"> Email   </label>
                        <input type="email" name="email"
                            onChange={(e) => {
                                setNewAdmin({ ...newAdmin, email: e.target.value });
                            }} className="w-full border  p-1 text-sm" />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700"> Phone   </label>
                        <input type="phone" name="phone"
                            onChange={(e) => {
                                setNewAdmin({ ...newAdmin, phone: e.target.value });
                            }} className="w-full border  p-1 text-sm" />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700"> Set Password   </label>
                        <input type="text" name="password"
                            onChange={(e) => {
                                setNewAdmin({ ...newAdmin, password: e.target.value });
                            }} className="w-full border  p-1 text-sm" />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700"> Is Read Only   </label>
                        <input type="checkbox" name="password"
                            onChange={(e) => {
                                setNewAdmin({ ...newAdmin, read_only: e.target.checked });
                            }} className="w-full border  p-1 text-sm" />

                            
                    </div>

                    <div className="col-span-3 sm:col-span-3">                 
                        <button
                            className="bg-gray-700   rounded text-white px-8 py-2 text-sm"
                            type="submit"  onClick={() => {
                                AddAdmin();  }}  >
                            Save
                        </button>{" "}
                    </div>
                </div>
            </div>
        </div>

    );
};



export default AddNew;
