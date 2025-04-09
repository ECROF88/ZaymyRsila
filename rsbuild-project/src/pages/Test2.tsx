import type React from "react";
import { useCallback, useState, useTransition } from "react";

const tabs = [
	{ label: "Home", value: "home" },
	{ label: "Movie", value: "movie" },
	{ label: "About", value: "about" },
];

export default function Test2() {
	const [activeTab, setActiveTab] = useState("home");
	const [isPending, setTrans] = useTransition();
	const hanlderBtnClick = useCallback((tab: string) => {
		setTrans(() => setActiveTab(tab));
	}, []);
	return (
		<div className="text-center mt-10">
			<div className="mb-6">
				{tabs.map((tab) => (
					<TabButton
						key={tab.value}
						label={tab.label}
						isActive={activeTab === tab.value}
						onClick={() => hanlderBtnClick(tab.value)}
					/>
				))}
			</div>

			{/* 内容显示 */}
			{isPending && <p>is pending</p>}
			<div className="text-xl font-bold">
				{activeTab === "home" && "Welcome to Home!"}
				{activeTab === "movie" && <MovieTab />}
				{activeTab === "about" && "Welcome to About!"}
			</div>
		</div>
	);
}

interface TabButtonProps {
	label: string;
	isActive: boolean;
	onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
	return (
		<button
			className={`px-12 py-3 mx-2 rounded-lg text-white text-base transition-colors ${
				isActive ? "bg-orange-400" : "bg-blue-400"
			}`}
			onClick={onClick}
		>
			{label}
		</button>
	);
};

const MovieTab: React.FC = () => {
	const items = Array.from({ length: 30000 })
		.fill("movie2")
		.map((item, index) => (
			<p key={index} className="text-base">
				{item}
			</p>
		));
	return (
		<>
			<h1>This is MovieTab</h1>
			{items}
		</>
	);
};
