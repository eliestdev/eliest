import { clearErrors } from 'features/games/gameSlice';
import React from 'react'
import { useDispatch } from 'react-redux';
import './error.css';

const ErrorUI = ({ errors }) => {
    const dispatch = useDispatch()

    const handleClearErrors = () => {
        dispatch(clearErrors())

    }

    return (
        <div className="error p-2 bg-red-400 bottom-0">
            <div className="sm:w-1/2 flex flex-row justify-around w-full">
                <div className="w-fill text-left">
                    {errors.map(error =>
                        <h2 className="text-gray-100   w-full">{error}</h2>
                    )}
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-2xl text-white cursor-pointer self-center" onClick={() => handleClearErrors()} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    );
}

export default ErrorUI;