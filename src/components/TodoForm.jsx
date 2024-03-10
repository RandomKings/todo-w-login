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
        <input
          type="text"
          id="item"
          placeholder="Add Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          style={{
            backgroundColor: "#d5e3f0",
            borderRadius: "20px",
            color: "black" // Set the text color to black
          }}
          className="rounded"
        />

        </div>
        <button className="bg-pink-500 hover:bg-pink-400 text-white font-bold py-2 px-4 border-b-4  hover:border-pink-500 rounded" style={{ borderRadius: "20px" }} onClick={handleSubmit}>
          Add
        </button>
      </form>
    </div>
  );
}
