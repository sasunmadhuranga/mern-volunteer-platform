export default function ConfirmationModel({message, onConfirm, onCancel}){
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col bg-white relative w-[500px] rounded-xl overflow-hidden shadow-lg">
                <p className="flex justify-center my-8">{message}</p>
                <div className="flex border-t border-gray-200">
                    <button 
                    onClick={onConfirm}
                    className="w-full py-3 font-semibold text-red-600 hover:bg-gray-200 transition flex justify-center items-center">
                        Yes
                    </button>
                    <button 
                    onClick={onCancel}
                    className="w-full py-3 font-semibold text-gray-700 hover:bg-gray-200 transition flex justify-center items-center ">
                        No
                    </button>
                </div>
            </div> 
        </div>
    );
}