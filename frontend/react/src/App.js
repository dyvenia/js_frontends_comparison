import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TodoList from "./components/TodoList";
import Login from './components/Login'
import Cookies from 'js-cookie'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const token = Cookies.get('token')
  let navigate = useNavigate()

  useEffect(() => {

    if (!token) {
      navigate('/')
      return
    }

    setLoggedIn(true)
  }, [])



  return (
    <Routes>
      <Route path='/' exact element={<Login />} />
      <Route path='/todos' element={<TodoList loggedIn={loggedIn} setLoggedIn={setLoggedIn} navigate={navigate} token={token} />} />
    </Routes>
  );
}

export default App;
