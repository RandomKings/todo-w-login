import { useState } from "react";
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from "/firebase";

export function TodoForm({}) {
  const [newItem, setNewItem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser; // Get the current user
      if (!user) {
        throw new Error("No user logged in"); // Handle case where no user is logged in
      }
  
      if (newItem.trim() === "") {
        throw new Error("Task cannot be empty"); // Throw error if task is empty
      }
  
      await addDoc(collection(db, 'tasks'), {
        title: newItem,
        completed: false,
        created: Timestamp.now(),
        userid: user.uid // Include the user's unique ID
      });
      setNewItem(""); // Clear newItem after adding task
    } catch (err) {
      alert(err);
    }
  };
  

  return (
    <div>
      <form className="new-item-form">
        <div className="form-row">
          <label htmlFor="item">New item</label>
          <input
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </div>
        <button className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 border-b-4 border-pink-700 hover:border-pink-500 rounded" onClick={handleSubmit}>
          Add
        </button>
      </form>
    </div>
  );
}
