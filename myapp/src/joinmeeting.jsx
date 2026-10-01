import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import "./css/home.css"

function BrandMark({ size = 30 }) {
    return (
        <svg viewBox="0 0 100 100" width={size} height={size} className="Brand-Rings">
            <circle cx="50" cy="50" r="46" className="Ring Ring-Outer" />
            <circle cx="50" cy="50" r="30" className="Ring Ring-Inner" />
            <circle cx="50" cy="50" r="7" className="Ring-Dot" />
        </svg>
    )
}

function JoinMeetingPage() {
    const navigate = useNavigate()
    const [meetingId, setMeetingId] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [muteAudio, setMuteAudio] = useState(false)
    const [muteVideo, setMuteVideo] = useState(false)

     async function GetToken() {
        const Token = localStorage.getItem("Token")

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


        return data.Token
    }



    async function handleJoin(e) {
        e.preventDefault()
        if (!meetingId.trim()) return
        const Token = await GetToken()


        const response = await fetch(`/JoinMeeting/${meetingId}`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({name : Token["username"],id : Token["id"]})
        })

        const data = await response.json()
 
        alert(data.status)

        if (data.status == "success") {
            navigate(`/Call/${meetingId}`)
            return
        }
    }

    return (
        <div className="Join-Shell">
            <div className="Bg-Glow" />

            <div className="Join-Card">
                <button className="Back-Link" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" className="Back-Icon">
                        <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>

                <div className="Join-Brand">
                    <BrandMark />
                    <span className="Brand-Name">zoomify</span>
                </div>

                <h1 className="Join-Title">Join a meeting</h1>
                <p className="Join-Subtitle">Enter a meeting ID to join instantly.</p>

                <form className="Join-Form" onSubmit={handleJoin}>
                    <label className="Field-Label" htmlFor="meetingId">Meeting ID</label>
                    <input
                        id="meetingId"
                        className="Join-Input"
                        type="text"
                        placeholder="123 456 7890"
                        value={meetingId}
                        onChange={e => setMeetingId(e.target.value)}
                    />

                    <label className="Field-Label" htmlFor="displayName">Your name</label>
                    <input
                        id="displayName"
                        className="Join-Input"
                        type="text"
                        placeholder="How others will see you"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                    />

                    <div className="Toggle-Row">
                        <label className="Toggle-Item">
                            <input
                                type="checkbox"
                                checked={muteAudio}
                                onChange={e => setMuteAudio(e.target.checked)}
                            />
                            <span className="Toggle-Box" />
                            Don't connect audio
                        </label>

                        <label className="Toggle-Item">
                            <input
                                type="checkbox"
                                checked={muteVideo}
                                onChange={e => setMuteVideo(e.target.checked)}
                            />
                            <span className="Toggle-Box" />
                            Turn off my video
                        </label>
                    </div>

                    <button type="submit" className="Join-Button" disabled={!meetingId.trim()}>
                        Join
                    </button>
                </form>
            </div>
        </div>
    )
}

export default JoinMeetingPage