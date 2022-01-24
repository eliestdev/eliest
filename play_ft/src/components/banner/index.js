export default function Banner({ data, type }) {

    if (type === "error") {
        return (
            <div className="bg-red-800">
                <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between flex-wrap">
                        <div className="w-0 flex-1 flex items-center">
                            <p className="ml-3 font-medium text-white truncate">
                                <span className="md:hidden">{data.message}</span>
                                <span className="hidden md:inline">{data.message}</span>
                            </p>
                        </div>
                        {/* <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                            <a
                                href="#"
                                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50"
                            >
                                Retry
                            </a>
                        </div> */}

                    </div>
                </div>
            </div>
        )
    }

}
