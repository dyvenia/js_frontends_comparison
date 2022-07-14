import Cookies from "js-cookie"

const LogOut = ({ setLoggedIn, navigate }) => {
    const onLogOut = () => {
        Cookies.remove('token')
        setLoggedIn(false)
        navigate('/')
    }
    return (
        <button className="btn" onClick={onLogOut}>LogOut</button>
    )
}

export default LogOut