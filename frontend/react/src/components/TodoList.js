import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import AddTodo from "./AddTodo"
import Todos from "./Todos"
import LogOut from "./LogOut"

const TodoList = ({ loggedIn, token, setLoggedIn }) => {
    const [todos, setTodos] = useState([])
    let navigate = useNavigate()
    useEffect(() => {
        fetchTodos((res) => {
            if (res.detail && res.detail === "Forbidden") {
                navigate("/")
                return
            }
            setTodos(res)
        })
    }, [])

    const fetchTodos = async (callback) => {
        const response = await fetch('http://localhost:8001/?token=' + token)
        const data = await response.json()
        return callback(data)
    }


    const addTodo = async (todo) => {
        const response = await fetch('http://localhost:8001', {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        const data = await response.json()

        setTodos([...todos, data])

    }

    const removeTodo = async (id) => {
        await fetch(`http://localhost:8001/${id}`, {
            method: "DELETE",
        })
        setTodos(todos.filter((todo) => todo.id !== id))
    }
    return (
        <>
            {loggedIn
                && <div className="container">
                    <AddTodo onAdd={addTodo} />
                    <LogOut setLoggedIn={setLoggedIn} navigate={navigate} />
                    <Todos onRemove={removeTodo} todos={todos} />
                </div>}
        </>
    )
}

export default TodoList