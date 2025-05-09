import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Test from './pages/Test';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Dashboard/Home';
import UserInfo from './pages/Dashboard/UserInfo';
import ReposLayout from './pages/Repos/ReposLayout';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/test" element={<Test />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="userinfo" element={<UserInfo />} />
            <Route path="repos" element={<ReposLayout />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
