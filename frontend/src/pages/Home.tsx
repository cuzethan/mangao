import NavBar from "../components/Navbar"

function Home() {
    return (
        <div className="h-screen flex flex-col">         
            <div className="text-2xl p-6 text-white font-bbh flex-1">
                <NavBar />
            </div>
            <div className="relative flex bg-[url('/home_background.jpg')] h-full bg-cover items-center justify-center">
                <h1 className="text-8xl text-black font-bbh">WELCOME TO MANGAO</h1>
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
        </div>
    )
}

export default Home