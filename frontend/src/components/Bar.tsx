export default function Bar() {
    return (
        <div className="font-nunito my-4 flex gap-4 items-center">
            <form className="border-solid border-2 border-white rounded-md p-2">
                <input type="text" placeholder="Search..." className="focus:outline-none"/>
            </form>
            <label className="flex gap-2">
                <input type="checkbox" /> Completed
                <input type="checkbox" /> Reading
                <input type="checkbox" /> Test 
            </label>
        </div>
    )
}