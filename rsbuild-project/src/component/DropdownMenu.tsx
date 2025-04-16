import type { MenuProps } from "antd";
import type React from "react";
import type { Repo } from "../utils/store";
import { EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, List } from "antd";
import useRepoData from "../pages/Repos/hooks/useRepoData";

interface DropdownMenuProps {
	// dataSource: Repo[];
	// selectedItem: Repo | null;
	// onItemSelect: (item: Repo | null) => void;
	menuItems: NonNullable<MenuProps["items"]>;
	onMenuClick?: (key: string, item: Repo) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	// dataSource,
	// selectedItem,
	// onItemSelect,
	menuItems,
	onMenuClick,
}) => {
	const { repos, selectedRepo, setSelectedRepo } = useRepoData();
	return (
		<List<Repo>
			// dataSource={dataSource}
			dataSource={repos}
			className="flex-auto"
			renderItem={(item) => (
				<List.Item
					key={item.name}
					onClick={(e) => {
						if (!(e.target as HTMLElement).closest(".ant-dropdown-trigger")) {
							setSelectedRepo(item);
						}
					}}
					className={`
		  border-gray-200
            border-2
            px-2 py-1
            cursor-pointer 
            transition-all duration-100 ease-in
            hover:bg-green-300
              ${
								selectedRepo?.name === item.name
									? "bg-green-500 border-l-8 border-gray-500"
									: "hover:border-l-6 hover:border-gray-500"
							}
          `}
					actions={[
						<Dropdown
							key="more"
							trigger={["click"]}
							menu={{
								items: menuItems,
								onClick: ({ key }) => onMenuClick?.(key, item),
							}}
						>
							<EllipsisOutlined className="text-gray-200 hover:text-blue-700" />
						</Dropdown>,
					]}
				>
					<List.Item.Meta
						className="px-2"
						title={
							<span
								className={`font-medium${selectedRepo?.name === item.name ? "text-green-700" : "text-gray-700"}`}
							>
								{item.name}
							</span>
						}
					/>
					<span className="border-2 bg-gray-200 border-gray-300  rounded-2xl px-1">
						{item.branch}
					</span>
				</List.Item>
			)}
		/>
	);
};

export default DropdownMenu;
