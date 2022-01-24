import './index.css'

const Stepper = ({ index }) => {

    return (
        <div className="p-4">
            <div className="mx-4 p-4">
                <div className="flex items-center">
                    <div className="flex items-center text-white relative">
                        <div
                            style={{ backgroundColor: index >= 0 ? '#00a650' : '#e5fff2' }}
                            className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-2 border-2 border-green-500 text-center step"
                        >
                            1
                        </div>

                    </div>
                    <div
                        className="flex-auto border-t-2 transition duration-500 ease-in-out border-green-500"
                    ></div>
                    <div className="flex items-center text-green-600 relative">
                        <div
                            style={{ backgroundColor: index >= 1 ? '#00a650' : '#e5fff2', color: index >= 1 ? '#fff' : '#99FFDE' }}
                            className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-2 border-2 border-green-100 bg-green-100 text-center step"
                        >
                            2
                        </div>

                    </div>
                    <div
                        className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"
                    ></div>
                    <div className="flex items-center text-green-600 relative">
                        <div
                            style={{ backgroundColor: index >= 2 ? '#00a650' : '#e5fff2', color: index >= 1 ? '#fff' : '#99FFDE' }}
                            className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-2 border-2 border-green-100 bg-green-100 text-center step"
                        >
                            3
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Stepper;