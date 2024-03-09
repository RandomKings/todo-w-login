import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, sg, db } from "/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchProfilePic(user.uid);
        await fetchUsername(user.uid); // Call fetchUsername directly with user.uid
      } else {
        setUser(null);
        setProfilePic(null);
        setUsername('');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfilePic = async (userId) => {
    try {
      const url = await getDownloadURL(ref(sg, `profile-pics/${userId}`));
      setProfilePic(url);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  const fetchUsername = async (userId) => { // Modify fetchUsername to accept userId parameter
    try {
      const q = query(
        collection(db, 'users'),
        where('uid', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsername(doc.data().username);
        setTempUsername(doc.data().username);
      });
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadBytes(ref(sg, `profile-pics/${user.uid}`), selectedFile);
      fetchProfilePic(user.uid);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempUsername(username); // Set tempUsername to current username when editing starts
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempUsername(username); // Reset tempUsername to current username when editing is canceled
  };

  const handleSaveEdit = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const todoDocRef = doc.ref;
        await updateDoc(todoDocRef, {
          username: tempUsername,
        });
      });
      setUsername(tempUsername);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  const handleTempUsernameChange = (e) => {
    setTempUsername(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-black">User Profile</h1>
        <Link to="/homepage" className="text-blue-500 mb-4">
          <ArrowBackIcon />
        </Link>
        {user && (
          <div className="flex flex-col items-center">
            <p className="mb-4 text-black">Email: {user.email}</p>
            <div className="mb-4">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={handleTempUsernameChange}
                    className="px-2 py-1 border border-gray-300 rounded-lg ml-2 text-black"
                  />
                  <CheckIcon onClick={handleSaveEdit} className="cursor-pointer text-green-500 ml-2" />
                  <ClearIcon onClick={handleCancelEdit} className="cursor-pointer text-red-500 ml-2" />
                </>
              ) : (
                <>
                  <span className="text-black">Username: {username}</span>
                  <button onClick={handleEdit} className="text-blue-500 ml-2">Edit</button>
                </>
              )}
            </div>
            {profilePic && (
              <img
                src={profilePic}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
            )}
            <div>
              <label htmlFor="profile-pic" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg">
                Change Picture
              </label>
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg mt-2"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
