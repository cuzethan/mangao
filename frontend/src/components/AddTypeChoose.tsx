interface AddTypeChooseProps {
    hideButton: () => void
    showAuto: () => void
    showManual: () => void
}

export default function AddTypeChoose({hideButton, showAuto, showManual}: AddTypeChooseProps) {

    function handleManual() {
        hideButton();
        showManual();
    }

    function handleAuto() {
        hideButton();
        showAuto();
    }

    return (
        <div className="flex flex-col gap-5 text-black">
            <button className="border-black border-solid border-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
            onClick={handleAuto}>
                Add With Autofill And Tracking
            </button>
            <button className="border-black border-solid border-2 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
            onClick={handleManual}>
                Add Manually
            </button>
        </div>
    )
}