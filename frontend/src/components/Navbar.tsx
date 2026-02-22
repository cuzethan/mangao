import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import api, { clearCsrfToken } from '../config/api'


export default function NavBar() {
    const { csrfToken, setCsrfTokenMaster } = useAuth()

    const navigate = useNavigate()

    async function logout() {
        try {
            await api.delete('auth/logout');
            setCsrfTokenMaster(null)
            clearCsrfToken()
            navigate('/');
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <nav className="w-full text-2xl text-white font-bbh flex-1">
            <ul className="flex items-center gap-5">
                {csrfToken ? (
                    <>
                        <li>
                            <Link to="/app">
                                <div className="flex">
                                    <img src="src/assets/cropped.png" className="w-10"></img>
                                    <h1 className="pt-1">Mangao</h1>
                                </div>
                            </Link>
                        </li>
                        <button onClick={logout} className="ml-auto border-2 border-white rounded-md p-2 hover:bg-gray-900 cursor-pointer">
                            <li>Logout</li>
                        </button>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/">
                                <div className="flex">
                                    <img src="src/assets/cropped.png" className="w-10"></img>
                                    <h1 className="pt-1">Mangao</h1>
                                </div>
                            </Link>
                        </li>
                        <Link to="/login" className="ml-auto border-2 border-white rounded-md p-2 hover:bg-gray-900">
                            <li>Login</li>
                        </Link>
                        <Link to="/signup" className="border-2 border-white rounded-md p-2 hover:bg-gray-900">
                            <li>Sign Up</li>
                        </Link>
                    </>
                )}
            </ul>
        </nav>
    )
}