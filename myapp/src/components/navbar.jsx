import { useNavigate ,useLocation } from "react-router-dom"

import "../css/navbar.css"

function Navbar({LoginValue,signOut}) {
  const navigate = useNavigate()
  const location = useLocation()

  function OnLogout() {
    if (localStorage.getItem("Token")) {
      localStorage.removeItem("Token")
      signOut()
    }

    navigate("/")
  }

  console.log(location.pathname)

    return (
      <div>
        {location.pathname !== "/home" && (     <nav className="navbar navBar" >
  <div className="container-fluid">
    <a className="navbar-brand" href="/">Zoomify</a>

    {LoginValue === true ? (
       <div className="ms-auto">
            <a className="navbar-brand" href="/Profile">Profile</a>
      <a className="navbar-brand" href="Settings">Settings</a>
      <a className="navbar-brand" href="/Login" onClick={OnLogout}>Log out</a>
    </div>
    ) : (
      <div className="ms-auto">
      <a className="navbar-brand" href="/Login">Login</a>
    </div>
    )}




  </div>
</nav>)}
      </div>


    )
}

export default Navbar