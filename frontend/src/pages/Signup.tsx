import { Link } from "react-router"
import { useState, useEffect } from "react"

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [pwConfirm, setPwConfirm] = useState('');
    const [showPWMessage, setPWMessage] = useState(false);

    //pwConditions
    const [hasLower, setHasLower] = useState(false);
    const [hasUpper, setHasUpper] = useState(false);
    const [hasSymbol, setHasSymbol] = useState(false);
    const [hasMinChar, setHasMinChar] = useState(false);
        

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (password === pwConfirm && checkPWConditions(password)) {
            console.log("WORKS!")
        }
        //validate if username does not exist
        //if so, redirect to login page to get tokens
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) {
        let value = event.target.value;
        if (value.length < 30) {
            setValue(value.trim())
        }
    }

    function checkPWConditions(password: string) {
        RegExp('[a-z]').test(password) ? setHasLower(true) : setHasLower(false)
        RegExp('[A-Z]').test(password) ? setHasUpper(true) : setHasUpper(false)
        RegExp('[!@#$%^&*]').test(password) ? setHasSymbol(true) : setHasSymbol(false)
        password.length >= 8 ? setHasMinChar(true) : setHasMinChar(false)
        return hasLower && hasUpper && hasSymbol && hasMinChar
    }

    useEffect(() => {
        if (password.length > 2) setPWMessage(true);
        else setPWMessage(false);
        checkPWConditions(password)
    }, [password])

    return (
        <div className="h-screen p-6 text-white font-bbh flex flex-col gap-5">
            <Link to="/" className="flex text-2xl pt-2">
                <img src="src/assets/cropped.png" className="w-10"></img>
                <h1 className="pt-1">Mangao</h1>
            </Link>
            <div className="flex flex-col items-center justify-center gap-6">
                <h1 className="text-center text-8xl">Signup</h1>
                <p className="text-lg">Already a member? <Link to="/" className="text-sky-300">Log in here </Link></p>
                <div className="border border-3 rounded-xl w-3/5 p-10">
                    <form method="post" className="text-2xl flex flex-col gap-5" onSubmit={handleSubmit}>
                        <label>
                            Username:  <input type="text" className="border p-1 rounded-lg w-full"
                            value={username} onChange={(e) => handleChange(e, setUsername)}/>
                        </label>
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
                                <p className={hasSymbol ? "text-green-500" : "text-red-500"}>~ A symbol (!@#$%^&*)</p>
                                <p className={hasMinChar ? "text-green-500" : "text-red-500"}>~ Minimum of 8 characters</p>
                            </div>
                        }
                        <button type="submit" className="border p-1 rounded-lg hover:bg-gray-950 cursor-pointer">Submit Form</button>
                    </form>
                </div>
            </div>
        </div>
    )
}