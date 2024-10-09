import React from "react";
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from "./components/auth/LoginForm.tsx";
import RegisterForm from "./components/auth/RegisterForm.tsx";
import MainScreen from "./components/MainScreen.tsx";

// const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//     const token = localStorage.getItem('token')
//     return token ? children : <Navigate to="/login" />
// }

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm/>} />
                <Route path="/main-screen" element={<MainScreen/>} />
            </Routes>
        </Router>
    )
}

export default App
