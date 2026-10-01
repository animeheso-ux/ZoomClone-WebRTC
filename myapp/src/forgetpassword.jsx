import { useState } from "react"
import {useNavigate} from "react-router-dom"
import "./css/Login.css"

function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [sent, setSent] = useState(false)
    const [Email,SetEmail] = useState("")
    const [code,SetCode] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
    }


    async function sendOTP() {
        if (Email == "") {
            return alert("blank fields.")
        }

        const response = await fetch("/SendOTP",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({Email : Email})
        })

        const data = await response.json()
    }

    async function validateOTP() {
          if (code == "") {
            return alert("blank fields.")
        }

        const response = await fetch("/ValidateOTP",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({code : code,Email : Email})
        })

        const data = await response.json()

        if (data.status == "success") {
            sessionStorage.setItem("Email",Email)
            navigate("/resetPassword")
        }
    }

    return (
        <div className="auth-screen">
            <div className="auth-brand">
                <div className="signal">
                    <span className="signal-ring signal-ring--1" />
                    <span className="signal-ring signal-ring--2" />
                    <span className="signal-ring signal-ring--3" />
                    <span className="signal-dot" />
                </div>
                <div className="auth-brand-copy">
                    <p className="wordmark">Zoomify</p>
                    <p className="tagline">Face to face, wherever you are.</p>
                </div>
            </div>

            <div className="auth-panel">
                <div className="auth-card" key={sent ? "sent" : "form"}>
                    {!sent ? (
                        <>
                            <h1>Reset your password</h1>
                            <p className="subtext">
                                Enter the email on your account and we'll send a link to reset it.
                            </p>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="field">
                                    <span>Email</span>
                                    <input type="email" placeholder="you@example.com" required onChange={(e)=> {SetEmail(e.target.value)}} />
                                </label>
                                <button type="submit" className="btn-primary" onClick={sendOTP}>Send reset link</button>
                            </form>

                            <p className="switch-line">
                                Remembered it?{" "}
                                <button className="link-btn" onClick={() => history.back()}>
                                    Back to login
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="sent-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M3 7l9 6 9-6M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h1>Enter the code sent to your email</h1>
                            <p className="subtext">
                                Enter OTP
                            </p>


                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="field">
                                    <span>Code</span>
                                    <input type="text" required  onChange={(e) => {SetCode(e.target.value)}}/>
                                </label>
                                <button type="submit" className="btn-primary" onClick={validateOTP}>Enter code</button>
                            </form>

                            <p className="switch-line">
                                Didn't get it?{" "}
                                <button className="link-btn" onClick={() => setSent(false)}>
                                    Try a different email
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage