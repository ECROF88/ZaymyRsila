import type { UserData } from '../../utils/store'
import { UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import { useState } from 'react'
import AvatarUpload from '../../component/AvatarUpload'
import { useUserStore } from './hooks/useUserData'

function UserInfo() {
  const [form] = Form.useForm()
  const { userData, updateUserData } = useUserStore()
  const [messageApi, contextHolder] = message.useMessage()
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async (values: UserData) => {
    try {
      await updateUserData(values)
      messageApi.open({
        type: 'success',
        content: '用户信息更新成功',
      })
      setIsEditing(false)
    }
    catch {
      messageApi.error({
        content: '更新失败',
      })
    }
  }

  return (
    <div className="p-6">
      {contextHolder}
      <Card title="个人信息" className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <AvatarUpload
            value={userData?.avatar}
            onChange={url => updateUserData({ ...userData, avatar: url })}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={userData}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="用户名"
            rules={[
              { required: true, message: '长度至少大于3', min: 3, max: 100 },
            ]}
          >
            {isEditing
              ? (
                  <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                )
              : (
                  <div className="text-lg">{userData.name}</div>
                )}
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            {isEditing
              ? (
                  <Input placeholder="请输入邮箱" />
                )
              : (
                  <div className="text-lg">{userData.email}</div>
                )}
          </Form.Item>

          <Form.Item className="text-right space-x-2">
            {isEditing
              ? (
                  <>
                    <Button onClick={() => setIsEditing(false)}>取消</Button>
                    <Button type="primary" htmlType="submit">
                      确认修改
                    </Button>
                  </>
                )
              : (
                  <Button type="primary" onClick={() => setIsEditing(true)}>
                    修改信息
                  </Button>
                )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default UserInfo
