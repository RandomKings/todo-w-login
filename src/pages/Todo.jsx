import { useState, useEffect } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { db } from "/firebase";
import { collection, query, where, orderBy, getDocs, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  async function filterTodos() {
    console.log("Current filter:", filter); // Log the current filter value

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
    console.log("Query snapshot:", querySnapshot.docs); // Log the retrieved documents

    const filteredTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    setTodos(filteredTasks); // Update todos state here
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
    <>
      <button
        onClick={handleHomePage}
        className="flex-none p-1.5 focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
      >
        Back to Homepage
      </button>
      <div>
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="space-x-2 mt-4">
        <button
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "ongoing" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
          onClick={() => setFilter("ongoing")}
        >
          Ongoing
        </button>
      </div>
      <TodoList
        tasks={todos}
        filter={filter}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </>
  );
}

export default Todo;
