import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import "./css/home.css"

function BrandMark({ size = 44 }) {
    return (
        <svg viewBox="0 0 100 100" width={size} height={size} className="Brand-Rings">
            <circle cx="50" cy="50" r="46" className="Ring Ring-Outer" />
            <circle cx="50" cy="50" r="30" className="Ring Ring-Inner" />
            <circle cx="50" cy="50" r="7" className="Ring-Dot" />
        </svg>
    )
}

function HomePage({ SetLogin }) {
    const navigate = useNavigate()
    const [now, setNow] = useState(new Date())
    const [username, setUsername] = useState("")

    async function GetToken() {
        const Token = localStorage.getItem("Token")

        if (!Token) {
              alert("Token not found")
            navigate("/")
            return
        }

        const response = await fetch("/GetToken", {
            headers: {
                "authorization": `Bearer ${Token}`,
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        if (data.status != "success") {
            alert("invalid session.")
            navigate("/")
            return
        }

        setUsername(data.Token["username"] )
        navigate("/Home")
        SetLogin()

        return data.Token
    }

    function GenerateMeetingCode() {
        let code = ""

        for (let i = 0; i < 6;i++) {
            const randomnum = Math.floor(Math.random() * 9)

            code += randomnum.toString()
        }

        return code
    }


    async function actionHandler(key,path) {
        if (key != "new") {
            return navigate(path)
        }
        const generateCode = GenerateMeetingCode()

        sessionStorage.setItem("MeetingCode" ,generateCode)

        navigate(`/Call/${generateCode}`)
    }



    useEffect(() => {
        GetToken()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    const dateString = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })

    const navItems = [
        { key: "home", label: "Home", icon: "M4 12l8-8 8 8M6 10v10h12V10" },
        { key: "chat", label: "Chat", icon: "M4 4h16v12H8l-4 4V4z" },
        { key: "meetings", label: "Meetings", icon: "M4 6h16v12H4z M15 9l5-3v10l-5-3" },
        { key: "contacts", label: "Contacts", icon: "M12 12a4 4 0 100-8 4 4 0 000 8z M4 21c0-4 4-6 8-6s8 2 8 6" },
        { key: "whiteboard", label: "Whiteboard", icon: "M3 5h18v12H3z M8 21h8" },
        { key: "calendar", label: "Calendar", icon: "M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16" },
        { key: "notes", label: "Notes", icon: "M5 3h14v18H5z M9 8h6 M9 12h6 M9 16h4" },
    ]

    const actions = [
        { key: "new", label: "New Meeting", sub: "Start an instant meeting", primary: true ,  pathTo : "/Call"  },
        { key: "join", label: "Join", sub: "Join with a code or link" , pathTo : "/JoinMeeting"},
        { key: "schedule", label: "Schedule", sub: "Plan a future meeting",  pathTo : "/" },
    ]

    return (
        <div className="Zoomify-Shell">
            <div className="Bg-Glow" />

            <aside className="Side-Bar-Div">
                <div className="Brand-Mark">
                    <span className="Brand-Name">Zoomify</span>
                </div>

                <nav className="Nav-List">
                    {navItems.map(item => (
                        <button key={item.key} className="Nav-Item">
                            <svg viewBox="0 0 24 24" className="Nav-Icon">
                                <path d={item.icon} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="Profile-Div">
                    <div className="Avatar-Ring">
                        <span>{(username || "U").charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="Profile-Meta">
                        <h1>{username || "Username"}</h1>
                    </div>
                </div>
            </aside>

            <main className="Main-Div">
                <header className="Greeting-Row">
                    <div>
                        <p className="Date-Text">{dateString}</p>
                        <h2 className="Time-Text">{timeString}</h2>
                    </div>
                    <p className="Greeting-Text">Face to face, wherever you are.</p>
                </header>

                <section className="Action-Grid">
                    {actions.map(action => (
                        <button
                            key={action.key}
                            className={`Action-Tile ${action.primary ? "Action-Primary" : ""}`}
                            onClick={() => {actionHandler(action.key,action.pathTo)}}
                        >
                            <span className="Tile-Icon" />
                            <span className="Tile-Label">{action.label}</span>
                            <span className="Tile-Sub">{action.sub}</span>
                        </button>
                    ))}
                </section>
            </main>

            <aside className="Upcoming-Panel">
                <h3>Upcoming</h3>
                <div className="Meeting-Card">
                    <span className="Meeting-Time">No meetings scheduled</span>
                    <p className="Meeting-Sub">Your day is clear — schedule one to get started.</p>
                </div>
            </aside>
        </div>
    )
}

export default HomePage