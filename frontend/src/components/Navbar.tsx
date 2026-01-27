import { Link } from "react-router"

export default function NavBar() {
    return (
        <nav className="w-full">
            <ul className="flex items-center gap-5">
                <li>
                    <Link to="/">
                    <div className="flex">
                        <img src="src/assets/cropped.png" className="w-10"></img>
                        <h1 className="pt-1">Mangao</h1>
                    </div>
                    </Link>
                </li>
                <li className="ml-auto border-2 border-white rounded-md p-2 hover:bg-gray-900">Login</li>
                <li className="border-2 border-white rounded-md p-2 hover:bg-gray-900">Sign Up</li>
            </ul>
        </nav>
    )
}