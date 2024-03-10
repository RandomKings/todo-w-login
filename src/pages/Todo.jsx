import { useState, useEffect } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { db } from "/firebase";
import { collection, query, where, orderBy, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/solid';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  async function filterTodos() {
    let q;

    switch (filter) {
      case "completed":
        q = query(
          collection(db, "tasks"),
          where("completed", "==", true),
          orderBy("created")
        );
        break;
      case "ongoing":
        q = query(
          collection(db, "tasks"),
          where("completed", "==", false),
          orderBy("created")
        );
        break;
      default:
        q = query(collection(db, "tasks"), orderBy("created"));
        break;
    }

    const querySnapshot = await getDocs(q);
    const filteredTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    setTodos(filteredTasks);
  }

  useEffect(() => {
    filterTodos().catch(error => {
      console.error('Error filtering todos:', error);
    });
  }, [filter]);

  async function addTodo(title) {
    const newTodoRef = await addDoc(collection(db, "tasks"), {
      title: title,
      completed: false,
      created: new Date().getTime()
    });

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: newTodoRef.id, title, completed: false },
    ]);
  }

  function handleHomePage() {
    navigate("/homepage");
  }

  function toggleTodo(id, completed) {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed } : todo
    );
    setTodos(updatedTodos);
  }

  function editTodo(id, newTitle) {
    const updatedTodos = todos.map((todo) =>
      id === todo.id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
  }

  function deleteTodo(id) {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  return (
    <div className="container mx-auto mt-0 p-4 bg-white rounded-lg shadow-lg text-black"> {/* Removed top margin */}
      <button
        onClick={handleHomePage}
        className="flex-none p-2 mr-2 focus:outline-none text-blue-500 hover:text-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm"
      > {/* Added right margin */}
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
      </button>
      <div className="mt-4 text-center">
        <h1 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Todo List</h1>
      </div>
      <div className="mt-4">
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-lg text-lg"> {/* Increased font size */}
          <TodoList
            tasks={todos}
            filter={filter}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        </div>
      </div>
    </div>
  );
  
}

export default Todo;
