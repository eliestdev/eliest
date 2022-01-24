import React from "react";
export default function Index({}) {

  const profile = JSON.parse(localStorage.getItem("token"))
  return (
    <>
      <div className="flex items-center justify-center py-8 px-4">
        <div className="md:w-1/2 rounded-md shadow-lg p-5 dark:bg-gray-800 bg-white">
          <h1 className="pt-2 pb-7 text-gray-800 dark:text-gray-100 font-bold text-lg">
            Profile Information
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-100 text-sm font-medium pl-3">
                {profile.name} 
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-100 text-sm font-medium pl-3">
                {profile.email}{" "}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-5">
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-100 text-sm font-medium pl-2">
                {profile.percentage}% ownership 
              </p>
  
            </div>
          </div>
        
        </div>
      </div>
    </>
  );
}
