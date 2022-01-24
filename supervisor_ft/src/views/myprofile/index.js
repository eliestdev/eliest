import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userGroupIcon, userIcon } from "components/icons";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "features/authentication/authSlice";

Index.propTypes = {};

function Index({ profile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">
          <div className="flex items-center justify-center py-8 px-4">
            <div className="md:w-full rounded-md shadow-lg p-5 dark:bg-gray-800 bg-white">
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
                    {profile.lastname} {profile.firstname}{" "}
                    <span className="text-purple-500">
                      active:{" "}
                      {new Date(profile.created_at * 1000).toLocaleDateString()}
                    </span>
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
                    {profile.phone}{" "}
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
                    {profile.address} {" | "}{" "}
                    <span className="text-purple-500">{profile.state}</span>{" "}
                    {" | "}{" "}
                    <span className="text-purple-500">{profile.lg}</span>
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
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-100 text-sm font-medium pl-3">
                    <strong>Referral Code: </strong> {profile.refcode}
                  </p>
                </div>
                <a href="javascript:void(0)">
                  <p
                    className="text-sm font-medium cursor-pointer text-indigo-500"
                    onClick={() =>
                      navigator.clipboard.writeText(profile.refcode)
                    }
                  >
                    copy code
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Loading show={isLoading} />
    </div>
  );
}

export default Index;

const Loading = ({ show, setShow }) => (
  <div className={show != true && "hidden"}>
    <div className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0">
      <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
        <div className="flex items-center justify-center py-8 px-4">
          <div className="flex md:w-80 rounded shadow-lg p-6 justify-center  dark:bg-gray-800 bg-white">
            <i class="fas fa-circle-notch fa-spin text-8xl text-gray-800"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
);
