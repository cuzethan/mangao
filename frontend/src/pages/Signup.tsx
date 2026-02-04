import axios from 'axios'

import { Link, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { baseURL } from '../constants'

export default function Signup() {
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [pwConfirm, setPwConfirm] = useState('');
    const [showPWMessage, setPWMessage] = useState(false);
    const [showUserMessage, setUserMessage] = useState(false);
    const [showUserDNEMsg, setUserDNEMsg] = useState(false);
    const [showInternalErr, setInternalErr] = useState(false);

    //pwConditions
    const [hasLower, setHasLower] = useState(false);
    const [hasUpper, setHasUpper] = useState(false);
    const [hasNum, setHasNum] = useState(false);
    const [hasSymbol, setHasSymbol] = useState(false);
    const [hasMinChar, setHasMinChar] = useState(false);
    const [pwNotEqual, setPwNotEqual] = useState(false);

    const authURL = baseURL + "/auth"

    const isPasswordValid = hasLower && hasUpper && hasNum && hasSymbol && hasMinChar;
    const isUsernameValid = username.length >= 8; 
    const isFormValid = isPasswordValid && isUsernameValid;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log(password, pwConfirm)
        console.log(password === pwConfirm)
        e.preventDefault();

        if (showUserMessage) return;
        if (password !== pwConfirm) {
            setPwNotEqual(true)
            return;
        } 

        setPwNotEqual(false)
        const result = await axios.get(`${authURL}/usernameCheck/${username}`)
        if (result.data) { //user does not exist yet
            const response = await axios({
                method: "post",
                url: authURL+"/signup",
                data: { username, password }
            });
            if (response.status === 201) {
                navigate('/')
            }
            if (response.status === 500) {
                setInternalErr(true);
            }
        } else {
            setUserDNEMsg(true)
        } 
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) {
        let value = event.target.value;
        if (value.length < 30) {
            setValue(value.trim())
        }
    }

    function checkPWConditions(password: string) {
        const lower = /[a-z]/.test(password);
        const upper = /[A-Z]/.test(password);
        const number = /[0-9]/.test(password);
        const symbol = /[!@#$%^&*]/.test(password);
        const minChar = password.length >= 8;

        setHasLower(lower);
        setHasUpper(upper);
        setHasNum(number);
        setHasSymbol(symbol);
        setHasMinChar(minChar);
    }

    useEffect(() => {
        if (password.length <= 2) setPWMessage(false);
        else {
            setPWMessage(true)
            checkPWConditions(password);
        }
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
                <h1 className="text-center text-8xl">Signup</h1>
                <p className="text-lg">Already a member? <Link to="/login" className="text-sky-300">Log in here </Link></p>
                <div className="border-3 rounded-xl w-3/5 p-10">
                    <form method="post" className="text-2xl flex flex-col gap-5" onSubmit={handleSubmit}>
                        <label>
                            Username:  <input type="text" className="border p-1 rounded-lg w-full"
                            value={username} onChange={(e) => handleChange(e, setUsername)}/>
                        </label>
                        {showUserMessage && <p className="text-2xl text-red-500">Make sure username contains at least 8 characters</p>}
                        <label>
                            Password: <input type="password" className="border p-1 rounded-lg w-full"
                            value={password} onChange={(e) => handleChange(e, setPassword)}/>
                        </label>
                        <label>
                            Confirm Password: <input type="password" className="border p-1 rounded-lg w-full"
                            value={pwConfirm} onChange={(e) => handleChange(e, setPwConfirm)}/>
                        </label>
                        {showPWMessage && 
                            <div className="text-lg">
                                <p className="text-2xl">Your password must have the following:</p>
                                <p className={hasLower ? "text-green-500" : "text-red-500"}>~ A lower case letter</p>
                                <p className={hasUpper ? "text-green-500" : "text-red-500"}>~ An upper case letter</p>
                                <p className={hasNum ? "text-green-500" : "text-red-500"}>~ A number</p>
                                <p className={hasSymbol ? "text-green-500" : "text-red-500"}>~ A symbol (!@#$%^&*)</p>
                                <p className={hasMinChar ? "text-green-500" : "text-red-500"}>~ Minimum of 8 characters</p>
                            </div>
                        }
                        {pwNotEqual && <p className="text-2xl text-red-500">Make sure password matches with the confirmed password!</p>}
                        {showUserDNEMsg && <p className="text-2xl text-red-500">Username already exists, try a different one.</p>}
                        {showInternalErr && <p className="text-2xl text-red-500">Internal Server Error.</p>}
                        <button type="submit" 
                            disabled={!isFormValid} 
                            className={`border p-1 rounded-lg ${
                                isFormValid 
                                    ? "hover:bg-gray-950 cursor-pointer" 
                                    : "cursor-not-allowed"
                            }`}
                        >Submit Form
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}