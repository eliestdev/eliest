import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "features/authentication/authSlice";
import { Link } from "react-router-dom";
import { claimReward, getTargets } from "./api";
import { removeAuthToken, setAuthError } from "features/authentication/authSlice";
import './index.css'
import TargetDetails from './details'

Index.propTypes = {};

function Index({ user }) {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(user);
  const [targets, setTargets] = useState([]);
  const [claim, setClaim] = useState({});
  const [target, setTarget] = useState({
    open: false,
    data: null
  })

  let getProfile = async () => {
    setIsLoading(true)
    try {
      let response = await getTargets()
      if (response.status != "SUCCESS") {
      } else {
        setTargets(response.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  let tryClaim = async (tid) => {
    setIsLoading(true)
    try {
      let response = await claimReward(tid)
      if (response.status != "SUCCESS") {
      } else {
        setClaim({ ...claim, target: tid, message: response.message })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    getProfile()
  }, []);

  return (
    <>
    {/* <TargetDetails open={} setOpen={} target={}/> */}
      <div className="px-12 pt-6 pb-5" style={{ backgroundImage: `url(})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundColor: 'rgba(246, 246, 246, 0.97)' }}>
        <div className="flex justify-between pb-3">
          <div className="my_agents">My Targets</div>
          <div className="flex gap-3">
            <Link to="/profile/activate" className="ag-btn border border-0 rounded text-green-500 px-6 py-2 border-green-500 hover:bg-green-500 hover:text-white">Activate account</Link>
            <button className="ag-btn rounded text-white px-6 py-2 bg-red-500" onClick={(e) => {
              e.preventDefault();
              dispatch(removeAuthToken());
              dispatch(setAuthError(""));
            }}>Sign Out</button>
          </div>
        </div>

        <p className="ag-h">
          Search for targets, filter search as well
        </p>

        <div className="grid md:flex gap-5 py-5 w-full md:w-2/3">
          <input placeholder="From" className="md:w-1/3 w-full bg-gray-200 appearance-none border-2 border-gray-200 rounded w-2/3 md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" />
          <input placeholder="To" className="md:w-1/3 w-full bg-gray-200 appearance-none border-2 border-gray-200 rounded w-2/3 md:w-1/3 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-500" />
          <button className="ag-l btn-primary rounded text-white px-12 py-2">Search</button>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col lg:flex-row w-full items-start lg:items-center rounded bg-white ">
          <div className="w-full lg:w-2/3  dark:bg-gray-800 mx-auto">

            <table className="text-xs w-full">
              <thead>
                <tr className="border-b py-3 px-8">
                  <td className="table--title">Title</td>
                  <td className="table--title">Description</td>
                  <td className="table--title">Reward</td>
                  <td className="table--title">Start</td>
                  <td className="table--title">End</td>
                </tr>
              </thead>
              <tbody>

                {targets && targets.map((target) =>
                  <tr className="border-b p-1">
                    <td className="p-1">{target.target.title}</td>
                    <td className="p-1"> {target.target.description}</td>
                    <td className="p-1"> {target.assignment.reward}</td>
                    <td className="p-1"> {new Date(target.assignment.start * 1000).toDateString()}</td>
                    <td className="p-1"> {new Date(target.assignment.deadline * 1000).toDateString()}</td>
                    <td className="p-1"><div className="flex flex-col space-y-1">
                      <button onClick={() => { tryClaim(target.assignment.id) }}
                        className="  p-1 border   bg-gray-800 my-1 text-gray-100 rounded-md shadow-sm  "
                      >
                        Claim Reward
                      </button>
                      {claim.target == target.assignment.id && <p className="text-xs">{claim.message}</p>}
                    </div></td>
                  </tr>

                )}
              </tbody>
            </table>
          </div>
        </div>
        <Loading show={isLoading} />
      </div>
    </>
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
