import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db, auth } from '/firebase';
import { TodoItem } from "./TodoItem";

export function TodoList({ toggleTodo, deleteTodo, editTodo, filter }) {
  const [tasks, setTasks] = useState([]); // State for storing tasks
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // No user logged in, return empty array
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userid', '==', user.uid), // Filter tasks by userid
      orderBy('created')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));
      setTasks(fetchedTasks); // Update tasks state with fetched tasks
      setLoading(false);
    }, (err) => {
      setLoading(false);
      setError(err.message);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.data.completed;
    } else if (filter === 'ongoing') {
      return !task.data.completed;
    }
    return true; // If filter is 'all' or any other value, return all tasks
  });

  return (
    <div>
      <ul className="list">
        {filteredTasks.length === 0 && "No todos"}
        {filteredTasks.map(todo => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            completed={todo.data.completed}
            title={todo.data.title}
            toggleTodo={toggleTodo} // Pass down toggleTodo function
            deleteTodo={deleteTodo} // Pass down deleteTodo function
            editTodo={editTodo}     // Pass down editTodo function
          />
        ))}
      </ul>
    </div>
  );
}
