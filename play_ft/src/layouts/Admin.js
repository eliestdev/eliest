import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { Link } from "react-router-dom";

import Games from "views/games";
import Values from "views/values";

function Index() {
  const [sideWidth, setSideWidth] = useState(true);

  const sidebarHandler = () => {
    setSideWidth(!sideWidth)
  };
  return (
    <div className="flex flex-no-wrap min-h-screen">
      {/* Sidebar starts */}
      {/* Remove class [ hidden ] and replace [ sm:flex ] with [ flex ] */}
      <div className="w-64 absolute sm:relative bg-gray-800 shadow md:h-full flex-col justify-between hidden sm:flex min-h-screen">
        <div className="px-8">
          <div className="h-16 w-full flex items-center">
            <h3 className="font-extrabold text-gray-50">Eliest Admin</h3>
          </div>
          <ul className="mt-5">
            <li className="flex w-full justify-between text-gray-300 hover:text-gray-500 cursor-pointer items-center mb-6">
              <Link to="/admin/games">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-grid"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x={4} y={4} width={6} height={6} rx={1} />
                  <rect x={14} y={4} width={6} height={6} rx={1} />
                  <rect x={4} y={14} width={6} height={6} rx={1} />
                  <rect x={14} y={14} width={6} height={6} rx={1} />
                </svg>
                <span className="text-sm  ml-2">Games</span>
              </div>
              </Link>
             
            </li>
            <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
            <Link to="/admin/values">

              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-puzzle"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                </svg>
                <span className="text-sm  ml-2">Values</span>
              </div>
              </Link>
            </li>
            {/*
                        <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-compass" width={18} height={18} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="8 16 10 10 16 8 14 14 8 16" />
                                    <circle cx={12} cy={12} r={9} />
                                </svg>
                                <span className="text-sm  ml-2">Performance</span>
                            </div>
                        </li>
                        */}
          </ul>
        </div>
        <div className="px-8 border-t border-gray-700"></div>
      </div>
      <div
        className={
          " z-40 absolute bg-gray-800 shadow md:h-full flex-col justify-between sm:hidden  transition duration-150 ease-in-out min-h-screen w-64 transform " +
          (sideWidth === true ? "-translate-x-64": "")
        }
        id="mobile-nav"
      >
        <div
          className="h-10 w-10 bg-gray-800 absolute right-0 mt-16 -mr-10 flex items-center shadow rounded-tr rounded-br justify-center cursor-pointer"
          id="mobile-toggler"
          onClick={() => sidebarHandler("-translate-x-64")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-adjustments"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#FFFFFF"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx={6} cy={10} r={2} />
            <line x1={6} y1={4} x2={6} y2={8} />
            <line x1={6} y1={12} x2={6} y2={20} />
            <circle cx={12} cy={16} r={2} />
            <line x1={12} y1={4} x2={12} y2={14} />
            <line x1={12} y1={18} x2={12} y2={20} />
            <circle cx={18} cy={7} r={2} />
            <line x1={18} y1={4} x2={18} y2={5} />
            <line x1={18} y1={9} x2={18} y2={20} />
          </svg>
        </div>
        <div className="px-8 ">
          <div className="h-16 w-full flex mt-5 ">
            <h3 className="font-extrabold text-gray-50">Eliest Admin</h3>
          </div>
          <ul className="mt-5">

            <li className="flex w-full justify-between text-gray-300 hover:text-gray-500 cursor-pointer items-center mb-6">
            <Link to="/admin/games">
 <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-grid"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <rect x={4} y={4} width={6} height={6} rx={1} />
                  <rect x={14} y={4} width={6} height={6} rx={1} />
                  <rect x={4} y={14} width={6} height={6} rx={1} />
                  <rect x={14} y={14} width={6} height={6} rx={1} />
                </svg>
                <span className="text-sm  ml-2">Games</span>
              </div>
              </Link>
            </li>
            <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
            <Link to="/admin/values">
 <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-puzzle"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                </svg>
                <span className="text-sm  ml-2">Values</span>
              </div>
              </Link>
            </li>

            {/* <li className="flex w-full justify-between text-gray-600 hover:text-gray-500 cursor-pointer items-center mb-6">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <polyline points="7 8 3 12 7 16" />
                                    <polyline points="17 8 21 12 17 16" />
                                    <line x1={14} y1={4} x2={10} y2={20} />
                                </svg>
                                <span className="text-sm  ml-2">Deliverables</span>
                            </div>
                        </li>
                     */}
          </ul>
        </div>
        <div className="px-8 border-t border-gray-700"></div>
      </div>
      {/* Sidebar ends */}
      {/* Remove class [ h-64 ] when adding a card block */}
      <div className="container mx-auto py-10  md:w-4/5 w-11/12 px-6">
        {/* Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border */}
        <div className="w-full h-full rounded  border-gray-300">
        <Switch>
         <Route path="/admin/games" exact render={() => <Games profile={{}} />} />
         <Route path="/admin/values" exact render={() => <Values profile={{}} />} />
         <Redirect from="/" to="/admin/games" />
         </Switch>
        </div>
      </div>
    </div>
  );
}

export default Index;
