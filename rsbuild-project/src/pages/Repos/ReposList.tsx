import type { MenuProps } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DropdownMenu from "../../component/DropdownMenu";
import AddRepos from "./AddRepos";
import EditRepos from "./EdiRepos";
import { useRepoStore } from "./hooks/useRepoData";

const { Title } = Typography;
const items: MenuProps["items"] = [
	{
		key: "edit",
		icon: <EditOutlined />,
		label: "编辑",
	},
	{
		key: "delete",
		icon: <DeleteOutlined />,
		label: "删除",
		danger: true,
	},
];
const ReposList: React.FC = () => {
	const StyledButton = styled(Button)`
    background-color: #42c042ff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #2e7a2eff !important;
    }
  `;
	// const { repos, selectedRepo, setSelectedRepo } = useRepoData();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);

	const { fetchRepos } = useRepoStore();
	useEffect(() => {
		fetchRepos();
	}, []);
	return (
		<div className="flex flex-col h-full">
			<Title level={5} className="p-2">
				仓库列表
			</Title>
			<div style={{ display: "flex", justifyContent: "space-around" }}>
				<StyledButton
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalOpen(true)}
					className="dynamicStyle"
				>
					添加仓库
				</StyledButton>
			</div>
			<Divider className="my-0" />
			<DropdownMenu
				// dataSource={repos}
				// selectedItem={selectedRepo}
				// onItemSelect={setSelectedRepo}
				menuItems={items}
				onMenuClick={(key, item) => {
					if (key === "edit") {
						setIsEditOpen(true);
					} else if (key === "delete") {
						console.log("delete", item);
					}
				}}
			/>
			<EditRepos isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
			<AddRepos isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
		</div>
	);
};

export default ReposList;
