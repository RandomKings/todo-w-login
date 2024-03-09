import { useState } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "/firebase";

export function TodoItem({ completed, id, title }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isChecked, setIsChecked] = useState(completed);

  const handleUpdate = async () => {
    const todoDocRef = doc(db, "tasks", id);
    try {
      await updateDoc(todoDocRef, {
        title: editedTitle,
        completed: isChecked, // Update completed status
      });
      setIsEditing(false); // Turn off editing mode after update
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async () => {
    const todoDocRef = doc(db, "tasks", id);
    try {
      await deleteDoc(todoDocRef);
    } catch (err) {
      alert(err);
    }
  };

  const handleCheckedChange = async (e) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked); // Update local state
    const todoDocRef = doc(db, "tasks", id);
    try {
      await updateDoc(todoDocRef, {
        completed: isChecked, // Update completed status in the database
      });
    } catch (err) {
      alert(err);
    }
  };

  let todoContent;

  if (isEditing) {
    // Render edit mode
    todoContent = (
      <>
        <input
          className="block mb-1 text-sm font-medium text-gray-900 dark:text-black grow"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <button
          className="flex-none focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          onClick={handleUpdate}
          disabled={editedTitle.length === 0}
        >
          Save
        </button>
      </>
    );
  } else {
    // Render view mode
    todoContent = (
      <>
        <div className="grow">{title}</div>
        <button
          className="flex-none focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900"
          onClick={() => setIsEditing(true)} // Set isEditing to true on click
        >
          Edit
        </button>
      </>
    );
  }

  return (
    <li>
      <label className="flex w-full">
        <input
          id={`checkbox-${id}`} // Unique id for each checkbox
          className="checkbox-custom" // Custom styling for the checkbox
          name="checkbox"
          checked={isChecked}
          onChange={handleCheckedChange} // Call handleCheckedChange on change
          type="checkbox"
        />
        {todoContent}
        <button
          className="flex-none p-1.5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={handleDelete}
        >
          Delete
        </button>
      </label>
    </li>
  );
}
