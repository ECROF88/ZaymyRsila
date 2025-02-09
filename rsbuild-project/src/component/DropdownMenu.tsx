import React from "react";
import { List, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import useRepoData from "../pages/Repos/hooks/useRepoData";
import { Repo } from "../utils/store";

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
          key={item.id}
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest(".ant-dropdown-trigger")) {
              // onItemSelect(item);
              setSelectedRepo(item);
            }
          }}
          className={`
            border-amber-100
            border-2
            px-6 py-3 
            cursor-pointer 
            transition-all duration-200 ease-in-out
            hover:bg-gray-100
            ${
              // selectedItem?.id === item.id
              selectedRepo?.id === item.id
                ? "bg-green-100 border-l-4 border-green-500"
                : "hover:border-l-6 hover:border-gray-300"
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
              <EllipsisOutlined className="text-gray-500 hover:text-gray-700" />
            </Dropdown>,
          ]}
        >
          <List.Item.Meta
            title={
              <span
                className={`
                  font-medium
                  ${selectedRepo?.id === item.id ? "text-green-700" : "text-gray-700"}
                `}
              >
                {item.name}
              </span>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default DropdownMenu;
