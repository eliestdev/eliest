import React, { useState } from 'react';
import { createATarget } from './api';


const AddNew = () => {
  const [newTarget, setNewTarget] = useState({ title: "", description: "", target: 0 });
  const [isLoading, setIsLoading] = useState(false);

  let createTarget = async () => {
    setIsLoading(true)
    try {
      let response = await createATarget(newTarget)
      if (response.status !== "SUCCESS") {
      } else {
        alert("Success")
        window.location.reload()
      }
    } catch (error) {
      alert("failed")

    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="px-4 py-5 bg-white sm:p-6">
      <div className="grid grid-cols-6 gap-6">

        <div className="col-span-4 sm:col-span-3 lg:col-span-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"  name="title"   id="title"
            onChange={(e) => { setNewTarget({ ...newTarget, "title": e.target.value }) }}
            className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div className="col-span-4 sm:col-span-3 lg:col-span-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"  name="description"   id="description"
            onChange={(e) => { setNewTarget({ ...newTarget, "description": e.target.value }) }}
            className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div className="col-span-4 sm:col-span-3 lg:col-span-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Income target
          </label>
          <input
            type="number"
            name="target"
            id="target"
            onChange={(e) => { setNewTarget({ ...newTarget, "target": Number(e.target.value) }) }}
            className="w-full border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-500 dark:text-gray-400"
          />
        </div>

        <div className="col-span-4 sm:col-span-3 lg:col-span-2 self-end">
          <button onClick={() => createTarget()} className="self-center bg-indigo-700 focus:outline-none transition duration-150 ease-in-out hover:bg-indigo-600 rounded text-white px-8 py-2 text-sm" type="submit">
            Save
          </button>
        </div>
      </div>
    </div>

  );
};



export default AddNew;
