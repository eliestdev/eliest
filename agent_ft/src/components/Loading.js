import React from 'react';

const Loading = ({ show, setShow }) => (
    <div className={show !== true && "hidden"}>
      <div
        className="py-12 bg-gray-700 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
        id="modal"
      >
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

export default Loading;
