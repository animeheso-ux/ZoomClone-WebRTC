import { useState } from 'react'
import './App.css'
import {Routes , Route} from "react-router-dom"


import DefaultPage from "./default.jsx"
import LoginPage from './login.jsx'
import HomePage from './home.jsx'
import ForgotPasswordPage from './forgetpassword.jsx'
import ResetPasswordPage from "./resetpassword.jsx"
import JoinMeetingPage from './joinmeeting.jsx'
import CallPage from "./call.jsx"

import Navbar from './components/navbar.jsx'


function App() {
  const [isLogin,SetLogin] = useState(false)

  return (
    <>
    <div>

      <Navbar LoginValue={isLogin} signOut={() => {SetLogin(false)}}/>


      <Routes>
        <Route path={"/"} element={<DefaultPage/>}></Route>
        <Route path={"/login"} element={<LoginPage/>}></Route>
                <Route path={"/home"} element={<HomePage SetLogin={()=> {SetLogin(true)}} />}></Route>
                <Route path={"/forgetPassword"} element={<ForgotPasswordPage/>}></Route>
                <Route path={"/resetPassword"} element={<ResetPasswordPage/>}></Route>
                        <Route path={"/JoinMeeting"} element={<JoinMeetingPage/>}></Route>
                  <Route path={"/Call/:meeting_id"} element={<CallPage/>}></Route>
      </Routes>
    </div>
    </>
  )
}

export default App
