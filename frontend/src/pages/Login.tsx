import axios from 'axios'

import { Link, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { baseURL } from '../constants'

export default function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fieldIsEmpty, setFieldIsEmpty] = useState(false);
    const [invalidLogin, setInvalidLogin] = useState(false)

    const authURL = baseURL + "/auth"

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!(username && password)) {
            setFieldIsEmpty(true);
            return;
        }

        setFieldIsEmpty(false);

        try {
            const response = await axios.post(`${authURL}/login`, 
                { username, password },
                { withCredentials: true }
            )
            setInvalidLogin(false);
            console.log("Works!")

        } catch { setInvalidLogin(true) }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) {
        let value = event.target.value;
        if (value.length < 30) {
            setValue(value.trim())
        }
    }

    return (
        <div className="h-screen p-6 text-white font-bbh flex flex-col gap-5">
            <Link to="/" className="flex text-2xl pt-2">
                <img src="src/assets/cropped.png" className="w-10"></img>
                <h1 className="pt-1">Mangao</h1>
            </Link>
            <div className="flex flex-col items-center justify-center gap-6">
                <h1 className="text-center text-8xl">Login</h1>
                <p className="text-lg">Don't have an account? <Link to="/signup" className="text-sky-300">Sign up here!</Link></p>
                <div className="border-3 rounded-xl w-3/5 p-10">
                    <form method="post" className="text-2xl flex flex-col gap-5" onSubmit={handleSubmit}>
                        <label>
                            Username:  <input type="text" className="border p-1 rounded-lg w-full"
                            value={username} onChange={(e) => handleChange(e, setUsername)}/>
                        </label>
                        <label>
                            Password: <input type="password" className="border p-1 rounded-lg w-full"
                            value={password} onChange={(e) => handleChange(e, setPassword)}/>
                        </label>
                        {fieldIsEmpty && <p className="text-2xl text-red-500">One or both fields are empty.</p>}
                        {invalidLogin && <p className="text-2xl text-red-500">Login is invalid. Try again.</p>}
                        <button type="submit" className="border p-1 rounded-lg hover:bg-gray-950 cursor-pointer">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}