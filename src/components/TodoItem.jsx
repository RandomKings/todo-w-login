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
        completed: isChecked,
      });
      setIsEditing(false);
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
    setIsChecked(isChecked);
    const todoDocRef = doc(db, "tasks", id);
    try {
      await updateDoc(todoDocRef, {
        completed: isChecked,
      });
    } catch (err) {
      alert(err);
    }
  };

  let todoContent;

  if (isEditing) {
    todoContent = (
      <>
        <input
          className="block mb-1 text-sm font-medium text-gray-900 dark:text-black grow"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <button
          className="flex-none focus:outline-none text-white bg-pink-300 hover:bg-pink-400 focus:ring-4 focus:ring-pink-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-pink-400 dark:hover:bg-pink-500 dark:focus:ring-pink-900"
          onClick={handleUpdate}
          disabled={editedTitle.length === 0}
        >
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        <div className="grow">{title}</div>
        <button
          className="flex-none focus:outline-none text-white bg-blue-300 hover:bg-blue-400 focus:ring-4 focus:ring-blue-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-900"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      </>
    );
  }

  return (
    <li className="py-2">
      <label className="flex w-full">
        <input
          id={`checkbox-${id}`}
          className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
          checked={isChecked}
          onChange={handleCheckedChange}
          type="checkbox"
        />
        {todoContent}
        <button
          className="flex-none p-1.5 focus:outline-none text-white bg-red-300 hover:bg-red-400 focus:ring-4 focus:ring-red-200 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-900"
          onClick={handleDelete}
        >
          Delete
        </button>
      </label>
    </li>
  );
}
