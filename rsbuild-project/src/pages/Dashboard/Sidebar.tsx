import React from "react";
import { Layout, Menu } from "antd";
import {
  ApartmentOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router";
interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}
const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = React.useMemo(
    () => [
      {
        key: "home",
        icon: <HomeOutlined />,
        label: "主页",
        path: "/dashboard/home",
      },
      {
        key: "user",
        icon: <UserOutlined />,
        label: "用户信息",
        path: "/dashboard/userinfo",
      },
      {
        key: "repos",
        icon: <ApartmentOutlined />,
        label: "我的仓库",
        path: "/dashboard/repos",
      },
    ],
    [],
  );

  const defaultSelectedKey = React.useMemo(() => {
    return (
      menuItems.find((item) => location.pathname.startsWith(item.path))?.key ||
      "home"
    );
  }, [location.pathname, menuItems]);

  const handleMenuClick = (key: string) => {
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider width={200} theme="light">
      <div style={{ height: "64px", padding: "16px", textAlign: "center" }}>
        <h2>管理系统</h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[defaultSelectedKey]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </Sider>
  );
};

export default Sidebar;
