import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./css/login.css"

function LoginPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState("login")
    const [password,setpassword] = useState("")
    const [username,setusername] = useState("")
    const [email,setemail] = useState("")
    const [confrimPassword,setConfrim] = useState("")


    async function GetToken() {
        const Token = localStorage.getItem("Token")

        const response = await fetch("/GetToken",{
            headers : {
                "authorization" : `Bearer ${Token}`,
                "Content-Type" : "application/json"
            }
        })


        const data = await response.json()

        if (data.status != "success") {
            return}


            navigate("/Home")


      return data.Token
    }


    async function Login() {
        if (password == "" || email == "" ) {
            alert("fields cannot be blank.")
            return
        }


            const response = await fetch("/LoginAccount",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({password : password , email : email})
        })


        const Data = await response.json()

        alert(Data.status)
        if (Data.status == "success") {
            localStorage.setItem("Token",Data.Token)
            navigate("/home")
        }
    }

    async function CreateAccount() {
        if (password == "" || email == "" || username == "") {
            alert("fields cannot be blank.")
            return
        }
        if (password !== confrimPassword) {
            alert("passwords do not match.")
            return
        }


        const response = await fetch("/CreateAccount",{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({username : username , password : password , email : email})
        })


        const Data = await response.json()

        alert(Data.status)
        if (Data.status == "success") {
            setPage("login")
        }
    }


    useEffect(()=> {
        GetToken()
    },[])

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
                <div className="auth-card" key={page}>
                    {page === "login" ? (
                        <>
                            <h1>Welcome back</h1>
                            <p className="subtext">Sign in to join your next call.</p>

                            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                                <label className="field">
                                    <span>Email/Username</span>
                                    <input type="text" placeholder="you@example.com/User" onChange={(e)=> {setemail(e.target.value)}}/>
                                </label>
                                <label className="field">
                                    <span>Password</span>
                                    <input type="password" placeholder="••••••••" onChange={(e)=> {setpassword(e.target.value)}} />
                                </label>
                                <button type="submit" className="btn-primary" onClick={Login}>Sign in</button>
                            </form>

                            <p className="switch-line">
                                New to Zoomify?{" "}
                                <button className="link-btn" onClick={() => setPage("signup")}>
                                    Create an account
                                </button>
                            </p>
                            <p className="switch-line">
                                Forget Password?{" "}
                                <button className="link-btn" onClick={() => {navigate("/forgetPassword")}}>
                                    Reset here
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h1>Create your account</h1>
                            <p className="subtext">Takes less than a minute.</p>

                            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                                <label className="field">
                                    <span>Name</span>
                                    <input type="text" placeholder="Your name"  onChange={(e)=> {setusername(e.target.value)}} />
                                </label>
                                <label className="field">
                                    <span>Email</span>
                                    <input type="email" placeholder="you@example.com"  onChange={(e)=> {setemail(e.target.value)}} />
                                </label>
                                <label className="field">
                                    <span>Password</span>
                                    <input type="password" placeholder="Create a password"  onChange={(e)=> {setpassword(e.target.value)}} />
                                </label>
                                <label className="field">
                                    <span>Confrim password</span>
                                    <input type="password" placeholder="Confrim your password"  onChange={(e)=> {setConfrim(e.target.value)}} />
                                </label>
                                <button type="submit" className="btn-primary" onClick={CreateAccount}>Sign up</button>
                            </form>

                            <p className="switch-line">
                                Already have an account?{" "}
                                <button className="link-btn" onClick={() => setPage("login")}>
                                    Back to login
                                </button>
                            </p>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default LoginPage