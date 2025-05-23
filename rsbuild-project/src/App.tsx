import {
	BrowserRouter,
	Navigate,
	PrefetchPageLinks,
	Route,
	Routes,
} from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Dashboard/Home";
import UserInfo from "./pages/Dashboard/UserInfo";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import ReposLayout from "./pages/Repos/ReposLayout";
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import "./App.css";
import { useEffect } from "react";
import { initWebSocket } from "./utils/websocket";
import ProtectedRoute from "./route/PretectedRoute";
import Msg from "./pages/Dashboard/Msg";

function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen w-full">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Navigate to="/login" replace />} />

					<Route element={<ProtectedRoute />}>
						<Route path="/dashboard" element={<Dashboard />}>
							<Route index element={<Home />} />
							<Route path="home" element={<Home />} />
							<Route path="userinfo" element={<UserInfo />} />
							<Route path="message" element={<Msg />} />
							<Route path="repos" element={<ReposLayout />} />
						</Route>
					</Route>

					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
