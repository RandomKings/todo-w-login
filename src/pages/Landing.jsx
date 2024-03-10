import { Link, useNavigate } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "/firebase";

export default function Landing() {
  const navigate = useNavigate();
  const [signOut] = useSignOut(auth);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-8">Hey, welcome</h1>

        <div className="mb-4">
          <Link to="/todo">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Go to Todo List</button>
          </Link>
        </div>

        <div>
          <Link to="/profile">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">View Profile</button>
          </Link>
        </div>

        <div>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-4"
          >
            Sign Out
          </button>
        </div>
      </div>

      <NameAndStudentID name="Pranav Harish Nathani" studentID="2702293872" />
    </div>
  );
}

function NameAndStudentID({ name, studentID }) {
  return (
    <div className="text-center border border-gray-300 rounded-lg p-4 bg-gray-100 mt-8">
      <p className="text-lg text-gray-500 font-semibold">{name}</p>
      <p className="text-sm text-gray-500">Student ID: {studentID}</p>
    </div>
  );
}
