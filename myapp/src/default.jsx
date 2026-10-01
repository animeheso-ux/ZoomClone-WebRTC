import { useEffect } from "react"
import {useNavigate} from "react-router-dom"



function DefaultPage() {
    const navigate = useNavigate()


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
            navigate("/")
            return}


            navigate("/Home")


      return data.Token
    }

    useEffect(()=> {
        GetToken()
    },[])
    return (
        <div>
            <h1>Default</h1>
            <button onClick={() => {navigate("/Login")}}>Get started</button>
        </div>
    )
}


export default DefaultPage