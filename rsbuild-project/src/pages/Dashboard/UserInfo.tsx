import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Form, Input, message, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import AvatarUpload from "../../component/AvatarUpload";
import { useUserStore } from "./hooks/useUserData";
import { DepartmentInfo, getAllDepartment, mockGetAllDepartment, updateEmail, updatePassword } from "@/utils/api";

export interface PassWordChange {
	newPassword: string;
	confirmPassword: string;
}
function UserInfo() {
	const [emailForm] = Form.useForm();
	const [passwordForm] = Form.useForm();
	const { userData, updateUserData, fetchUserData } = useUserStore();
	const [messageApi, contextHolder] = message.useMessage();
	const [isEditing, setIsEditing] = useState(false);
	const [isPasswordEdit, setPasswordEdit] = useState(false);
	const [departments, setDepartments] = useState<DepartmentInfo[]>([]); // 新增：存储部门列表
	const [departmentsLoading, setDepartmentsLoading] = useState(false); // 新增：部门数据加载状态


	const handleEmailSubmit = async (values: { email: string; department_id: string; avatar?: string }) => {
		try {
			const emailString = values.email;
			console.log("email is ", emailString);
			// await updateUserData(values);
			const res = await updateEmail(values);
			console.log("更新邮箱Res:", res);
			messageApi.open({
				type: "success",
				content: "用户信息更新成功",
			});
			setIsEditing(false);
		} catch {
			messageApi.error({
				content: "更新失败",
			});
		}
	};

	const handlePasswordChange = async (values: PassWordChange) => {
		try {
			if (values.confirmPassword !== values.newPassword) {
				messageApi.error({
					content: "两次密码输入不一致",
				});
				throw new Error("两次密码输入不一致");
			}
			const res = await updatePassword(values.newPassword);
			console.log("更新密码Res:", res);
		} catch {
			messageApi.error({
				content: "更新失败",
			});
		}
	};

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const userGroup = userData?.group || "普通用户";

	useEffect(() => {
		const fetch = async () => {
			setLoading(true);
			setError(null);
			try {
				fetchUserData();
			} catch (err) {
				console.error("获取用户数据失败", err);
				setError(err instanceof Error ? err.message : "获取用户数据失败");
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, []);


	useEffect(() => {
		const fetchDepartments = async () => {
			setDepartmentsLoading(true);
			try {
				// const response = await getAllDepartment();
				const response = await mockGetAllDepartment();
				if (response.data.code === 200) {
					setDepartments(response.data.data);
				} else {
					messageApi.error(response.data.message || '获取小组列表失败');
				}
			} catch (err) {
				messageApi.error('获取小组列表失败');
				console.error("Failed to fetch departments:", err);
			} finally {
				setDepartmentsLoading(false);
			}
		};

		fetchDepartments();
	}, [messageApi]);

	return (
		<div className="p-6 items-center">
			{loading && <div>加载中...</div>}
			{error && <div className="text-red-500">{error}</div>}
			{contextHolder}
			<Card title="个人信息" className="max-w-2xl w-full shadow-md">
				<div className="flex flex-col items-center mb-8">
					<AvatarUpload

						value={userData?.avatar}
						// value={"https://img.picui.cn/free/2025/05/21/682dcdc065687.png"}
						// onChange={(url) => updateUserData({ ...userData, avatar: url })}
						onChange={(url) => updateUserData({ ...userData, avatar: "https://img.picui.cn/free/2025/05/21/682dcdc065687.png" })}
					/>
				</div>
				<Divider orientation="left" className="bg-gray-100 ">
					用户信息设置
				</Divider>
				<Form
					form={emailForm}
					layout="vertical"
					initialValues={userData}
					onFinish={handleEmailSubmit}
				>
					<Form.Item label="用户名">
						<Input
							prefix={<UserOutlined className="text-gray-400" />}
							// value={userData.username}
							disabled
							className="bg-gray-50"
							placeholder={userData.username}
						/>
					</Form.Item>
					<Form.Item
						name="email"
						label="邮箱"
						rules={[{ type: "email", message: "请输入有效的邮箱地址" }]}
					>
						<Input
							prefix={<MailOutlined className="text-gray-400" />}
							placeholder={userData?.email}
							disabled={!isEditing}
						/>
					</Form.Item>

					<Form.Item
						label="小组"
						name="department_id" // name 应该与后端期望的字段匹配，通常是 ID
					>
						<Select
							placeholder="请选择小组"
							disabled={!isEditing || departmentsLoading} // 编辑时或部门加载时禁用
							loading={departmentsLoading} // Select 组件的加载状态
							allowClear // 允许清除选择
						>
							{departments.map((dept) => (
								<Select.Option key={dept.id} value={dept.id}>
									{dept.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item className="text-right space-x-2">
						{isEditing ? (
							<>
								<Button
									onClick={() => {
										setIsEditing(false);
										emailForm.resetFields();
									}}
									className="mr-2"
								>
									取消
								</Button>
								<Button type="primary" htmlType="submit">
									确认修改
								</Button>
							</>
						) : (
							<Button type="primary" onClick={() => setIsEditing(true)}>
								修改信息
							</Button>
						)}
					</Form.Item>
				</Form>

				<Divider orientation="left" className="bg-gray-100">
					密码设置
				</Divider>

				<Form
					form={passwordForm}
					layout="vertical"
					onFinish={handlePasswordChange}
				>
					<Form.Item
						name="newPassword"
						label="新密码"
						rules={[
							{ required: true, message: "请输入新密码" },
							{ min: 6, message: "密码长度不能少于6个字符" },
						]}
					>
						<Input.Password
							prefix={<LockOutlined className="text-gray-400" />}
							disabled={!isPasswordEdit}
							placeholder="请输入新密码"
						/>
					</Form.Item>

					<Form.Item
						name="confirmPassword"
						label="确认密码"
						dependencies={["newPassword"]}
						rules={[
							{ required: true, message: "请再次输入新密码" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("newPassword") === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error("两次输入的密码不一致!"));
								},
							}),
						]}
					>
						<Input.Password
							prefix={<LockOutlined className="text-gray-400" />}
							placeholder="请再次输入新密码"
							disabled={!isPasswordEdit}
						/>
					</Form.Item>

					<Form.Item className="text-right">
						{isPasswordEdit ? (
							<>
								<Button
									onClick={() => {
										setPasswordEdit(false);
										passwordForm.resetFields();
									}}
									className="mr-2"
								>
									取消
								</Button>
								<Button type="primary" htmlType="submit">
									确认修改
								</Button>
							</>
						) : (
							<>
								<Button
									type="primary"
									onClick={() => {
										setPasswordEdit(true);
									}}
								>
									修改密码
								</Button>
							</>
						)}
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
}

export default UserInfo;
