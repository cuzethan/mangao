import axios from 'axios'

import { Link, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { baseURL } from '../constants'

export default function Login() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const authURL = baseURL + "/auth"

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        //login
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) {
        let value = event.target.value;
        if (value.length < 30) {
            setValue(value.trim())
        }
    }

    useEffect(() => {
        if (password.length <= 2) setPWMessage(false);
    }, [password])

    useEffect(() => {
        if (username.length > 2 && username.length < 8) setUserMessage(true);
        else setUserMessage(false);
    }, [username])

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
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}