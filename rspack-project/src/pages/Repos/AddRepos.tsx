import { addRepo } from '../../utils/api';
import { Button, Form, Input, message, Modal } from 'antd';
import { useRepoStore } from './hooks/useRepoData';

// interface AddReposProps {
//   isModalOpen: boolean;
//   setIsModalOpen: (open: boolean) => void;
// }

export default function AddRepos({ isModalOpen, setIsModalOpen }) {
  const [messageApi, contextHolder] = message.useMessage();

  const handleAddRepo = async (values: {
    url: string;
    description?: string;
  }) => {
    console.log('添加仓库:', values.url);
    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 3,
    });
    try {
      const response = await addRepo(values.url);
      if (response.data.code === 0) {
        // 添加成功
        messageApi.open({
          type: 'success',
          content: '仓库添加成功',
        });
        // 可以通过 useRepoStore 更新仓库列表
        const newRepo = response.data.data;
        useRepoStore.getState().addRepo({
          name: newRepo.name,
          description: values.description,
          url: values.url,
        });
      } else {
        // 添加失败
        messageApi.open({
          type: 'error',
          content: response.data.message || '添加仓库失败',
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '添加仓库失败',
      });
      console.error('添加仓库出错:', error);
    } finally {
      setIsModalOpen(false);
    }
  };
  return (
    <div>
      {contextHolder}
      <Modal
        title="添加新仓库"
        open={isModalOpen}
        onCancel={() => {
          console.log('close');
          setIsModalOpen(false);
        }}
        footer={null}
        // className="backdrop-blur"
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            handleAddRepo(values);
          }}
        >
          <Form.Item name="url" label="URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="仓库描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item className="text-right">
            <Button type="primary" htmlType="submit">
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
