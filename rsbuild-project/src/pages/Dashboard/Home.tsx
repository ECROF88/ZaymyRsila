import { useUserStore } from "./hooks/useUserData";
import useRepoData from "../Repos/hooks/useRepoData";
import { Row, Col, Button, Avatar } from "antd";
import Card from "../../component/Card";
import {
  FolderOutlined,
  StarOutlined,
  TeamOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import NumberShow from "../../component/NumberShow";

function Home() {
  const { userData } = useUserStore();
  const { repos } = useRepoData();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 欢迎区域 */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex items-center gap-4">
          <Avatar size={64} src={userData?.avatar} />
          <div>
            <h1 className="text-2xl mb-2">欢迎回来，{userData?.name}！</h1>
            <p className="text-gray-500">{userData?.email}</p>
          </div>
        </div>
      </Card>

      {/* 统计区域 */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card bodyStyle={{ padding: "16px" }}>
            <NumberShow
              title="仓库总数"
              value={repos?.length || 0}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: "16px" }}>
            <NumberShow
              title="代码提交"
              value={123}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: "16px" }}>
            <NumberShow title="协作者" value={5} prefix={<TeamOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作区域 */}
      <Card title="快捷操作" className="mb-6 overflow-hidden">
        <div className="flex gap-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/dashboard/repos")}
          >
            添加仓库
          </Button>
          <Button
            icon={<TeamOutlined />}
            onClick={() => navigate("/dashboard/userinfo")}
          >
            个人信息
          </Button>
        </div>
      </Card>

      {/* 主要内容区域 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="最近活动" className="min-h-[300px] overflow-hidden">
            <p>暂无最近活动</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="常用仓库" className="min-h-[300px] overflow-hidden">
            {repos && repos.length > 0 ? (
              <ul className="list-none p-0">
                {repos.slice(0, 5).map((repo, index) => (
                  <li key={index} className="py-2 border-b last:border-b-0">
                    {repo.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>暂无仓库</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
