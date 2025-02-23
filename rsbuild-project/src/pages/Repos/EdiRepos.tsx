import type { Repo } from '@/utils/store'
// import React from "react";
import { Form, Input, message, Modal } from 'antd'
import { useRepoStore } from './hooks/useRepoData'

interface EditReposProps {
  isEditOpen: boolean
  setIsEditOpen: (open: boolean) => void
}

export default function EditRepos({ isEditOpen, setIsEditOpen }: EditReposProps) {
  const [form] = Form.useForm()
  // const { selectedRepo } = useRepoData();
  const [messageApi, contextHolder] = message.useMessage()

  // const setSelectedRepo = useRepoStore((s) => s.setSelectedRepo);
  const selectedRepo = useRepoStore(s => s.selectedRepo)
  // 提交处理
  const handleSubmit = async (values: Partial<Repo>) => {
    try {
      // TODO: 调用API更新仓库信息
      // const response = await updateRepo(selectedRepo.id, values);

      // 模拟更新成功
      //   message.success('仓库信息更新成功');
      messageApi.open({
        type: 'success',
        content: '仓库信息更新成功',
      })
      console.log(values)
      setIsEditOpen(false)
      form.resetFields()
    }
    catch (_) {
      message.error('更新失败，请重试')
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        title="编辑仓库"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={
            selectedRepo || {
              name: '',
              description: '',
              url: '',
            }
          }
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="仓库名称"
            rules={[{ required: true, message: '请输入仓库名称' }]}
          >
            <Input placeholder="请输入仓库名称" />
          </Form.Item>

          <Form.Item name="description" label="仓库描述">
            <Input.TextArea rows={4} placeholder="请输入仓库描述（选填）" />
          </Form.Item>

          <Form.Item
            name="url"
            label="仓库地址"
            rules={[{ required: true, message: '请输入仓库地址' }]}
          >
            <Input placeholder="请输入仓库地址" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
