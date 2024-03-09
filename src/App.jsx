import "./App.css";
import Todo from "./pages/Todo";
import Landing from "./pages/Landing";
import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile"; // Import the Profile component
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} exact />
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<Landing />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/profile" element={<Profile />} /> 
      </Routes>
    </Router>
  );
}

export default App;
