function OrgVerfication() {
    return (
        <div className="flex justify-center items-center bg-sky-100 px-4 py-12 md:px-20 lg:px-40">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 md:w-auto w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 w-full">
                {/* Event Type */}
                <div className="flex flex-col md:flex-row md:items-center md:space-x-2 w-full md:w-auto">
                    <label className="text-gray-700 mb-1 md:mb-0 md:mr-2 whitespace-nowrap">Event Name</label>
                    <select
                    className="border border-gray-400 rounded-md px-4 py-2 w-full"
                    >
                    <option value="">Select an event</option>
                    </select>
                </div>

                <div className="w-full md:w-auto">
                    <button
                    className="w-full bg-sky-600 text-white rounded-md px-6 py-2 hover:bg-sky-700 transition"
                    >
                    Search
                    </button>
                </div>
                </div>
            </div>
            
        </div>
    );
}

export default OrgVerfication;
