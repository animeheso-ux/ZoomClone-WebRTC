import { useState } from "react"
import "./css/login.css"

function ResetPasswordPage() {
    const [done, setDone] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [error, setError] = useState("")

    async function resetPassword() {
        const response = await fetch("/ResetPassword",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({Email : sessionStorage.getItem("Email"),newPassword : password})
        })

        const Data = await response.json()

        alert(Data.status)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            return
        }
        if (password !== confirm) {
            setError("Passwords don't match.")
            return
        }
        setError("")
        setDone(true)
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
                <div className="auth-card" key={done ? "done" : "form"}>
                    {!done ? (
                        <>
                            <h1>Set a new password</h1>
                            <p className="subtext">
                                Make it something you haven't used before.
                            </p>

                            <form className="auth-form" onSubmit={handleSubmit}>
                                <label className="field">
                                    <span>New password</span>
                                    <input
                                        type="password"
                                        placeholder="At least 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </label>
                                <label className="field">
                                    <span>Confirm password</span>
                                    <input
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                </label>

                                {error && <p className="field-error">{error}</p>}

                                <button type="submit" className="btn-primary" onClick={resetPassword}>Reset password</button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="sent-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 12l4.5 4.5L19 7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h1>Password updated</h1>
                            <p className="subtext">
                                Your password has been reset. You can now sign in with it.
                            </p>

                            <button className="btn-primary" onClick={() => (window.location.href = "/login")}>
                                Back to login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage