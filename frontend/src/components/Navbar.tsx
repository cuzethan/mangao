import { Link, useNavigate } from "react-router"
import axios, { AxiosError } from "axios"
import { baseURL } from "../constants"
import { useState, useEffect } from "react"

export default function NavBar() {

    const [isLoggedIn, setLoginState] = useState(false)

    const authURL = baseURL + "/auth"
    const navigate = useNavigate()

     async function logout() {
        try {
            await axios.delete( `${authURL}/logout`);
            navigate('/');
        } catch (err) {
            if (err instanceof AxiosError)
                console.log(err)
        }
    }

    async function checkLogin() {
        try {
            const csrfToken = document.cookie.split('=')[1]
            await axios.get(
                `${authURL}/verify`,{
                headers: {
                    "X-CSRF-TOKEN": csrfToken
                }
             })
            setLoginState(true);
        } catch (err) {
            console.log(err)
            setLoginState(false);
        }
    }

    useEffect(() => {
        checkLogin();
    }, [])


    return (
        <nav className="w-full text-2xl text-white font-bbh flex-1">
            <ul className="flex items-center gap-5">
                {isLoggedIn ? (
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