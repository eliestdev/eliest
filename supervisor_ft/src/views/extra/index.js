import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userGroupIcon, userIcon } from "components/icons";
import useFetch from "react-fetch-hook";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "features/authentication/authSlice";

Index.propTypes = {};

function Index({ profile }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

 const  getMyAgents = ()=>{
  setIsLoading(true);
  setError("");
  fetch(`${process.env.REACT_APP_SUPERVISOR_URL}v1/myagents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + JSON.parse(token).access_token,
    },
  })
    .then(async (response) => {
      setIsLoading(false);

      if (!response.ok) {
        throw response;
      }
      let data = await response.json();
      console.log(data)
      //setDirect(data.direct);
    })
    .then((data) => {})
    .catch((e) => {
      console.log(e);
      // e.text().then((errorMessage) => {
      //   setError(errorMessage);
      // });
    });
 }

 useEffect(() => {
   getMyAgents()
   return () => {
     
   };
 }, []);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
        <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto"></div>
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
