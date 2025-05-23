import { addMessage, getMessageUserData } from '@/utils/api';
import { message } from 'antd';
import { useState, useEffect } from 'react';

// 根据你提供的UserVo接口
export interface MessagePageUserVo {
  phone: string;
  email: string;
  department_name: string;
  create_time: string;
}

// 对应后端的AddMessageRequest结构
interface AddMessageRequest {
  content?: string;
  message_type?: string;
  user_id_vec?: string[];
}

interface MessageDialogProps {
  isOpen: boolean;
  selectedUsers: MessagePageUserVo[];
  onClose: () => void;
  onSend: (request: AddMessageRequest) => Promise<void>;
}

// 消息发送对话框组件
function MessageDialog({ isOpen, selectedUsers, onClose, onSend }: MessageDialogProps) {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState('normal');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!content.trim()) return;

    setSending(true);
    try {
      const request: AddMessageRequest = {
        content: content,
        message_type: messageType,
        user_id_vec: selectedUsers.map(user => user.phone)
      };

      await onSend(request);
      setContent('');
      onClose();
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('发送消息失败，请重试');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bg-black/50 inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            发送消息 ({selectedUsers.length} 个接收者)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* 接收者列表 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            接收者:
          </label>
          <div className="bg-gray-50 p-3 rounded-lg max-h-24 overflow-y-auto">
            {selectedUsers.map(user => (
              <div key={user.phone} className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-500">({user.department_name} {user.phone})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 消息类型 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            消息类型:
          </label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="repoupdate">更新消息</option>
            <option value="alert">紧急消息</option>
            <option value="notification">通知消息</option>
            <option value="system">系统消息</option>
          </select>
        </div>

        {/* 消息内容 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            消息内容:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入消息内容..."
            className="w-full border border-gray-300 rounded-lg p-3 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSend}
            disabled={!content.trim() || selectedUsers.length === 0 || sending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {sending ? '发送中...' : `发送给 ${selectedUsers.length} 人`}
          </button>
        </div>
      </div>
    </div>
  );
}

// 用户卡片组件
function UserCard({
  user,
  isSelected,
  onToggleSelect
}: {
  user: MessagePageUserVo;
  isSelected: boolean;
  onToggleSelect: (user: MessagePageUserVo) => void;
}) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      onClick={() => onToggleSelect(user)}
    >
      <div className="flex items-start space-x-3">
        {/* 选择框 */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(user)}
          className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />


        {/* 用户信息 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
          <p className="text-sm text-blue-600 truncate">{user.department_name}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">📱 {user.phone}</span>
            <span className="text-xs text-gray-400">{user.create_time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Msg() {
  const [users, setUsers] = useState<MessagePageUserVo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<MessagePageUserVo[]>([]);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);


  const generateMockUsers = (count: number): MessagePageUserVo[] => {
    const departments = ['技术部', '产品部', '市场部', '人事部', '财务部', '运营部', '设计部', '法务部'];
    const emailDomains = ['@company.com', '@tech.com', '@business.com'];

    return Array.from({ length: count }, (_, index) => {
      const phoneNumber = `138${String(index).padStart(8, '0')}`;
      const userName = `user${index + 1}`;
      const department = departments[Math.floor(Math.random() * departments.length)];
      const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];

      // 随机生成创建时间（最近30天内）
      const randomDays = Math.floor(Math.random() * 30);
      const createDate = new Date();
      createDate.setDate(createDate.getDate() - randomDays);

      return {
        phone: phoneNumber,
        email: `${userName}${emailDomain}`,
        department_name: department,
        create_time: createDate.toISOString().slice(0, 19).replace('T', ' ')
      };
    });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMessageUserData();
      console.log(res.data.data);
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户列表失败');
      console.error('获取用户列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 发送消息
  const handleSendMessage = async (request: AddMessageRequest) => {
    try {
      const res = await addMessage(request);
      if (res.data.code === 200) {
        // 成功处理
        message.success('消息发送成功');
        // 清空表单或执行其他成功后的操作
      } else {
        // API 返回了错误码但请求成功
        message.error(res.data.message || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }


  // 切换用户选择状态
  const toggleUserSelection = (user: MessagePageUserVo) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.phone === user.phone);
      if (isSelected) {
        return prev.filter(u => u.phone !== user.phone);
      } else {
        return [...prev, user];
      }
    });
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const filteredUsers = getFilteredUsers();
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
  };

  // 搜索过滤
  const getFilteredUsers = () => {
    return users.filter(user =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
    );
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">🔄 加载用户列表中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600">❌ 错误: {error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 消息管理</h1>
        <p className="text-gray-600">选择用户批量发送消息</p>
      </div>

      {/* 搜索和操作栏 */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* 搜索框 */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索用户 (邮箱、部门、姓名、手机号)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSelectAll}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? '取消全选' : '全选'}
            </button>
            <span className="text-gray-600">
              已选择 {selectedUsers.length} / {filteredUsers.length} 个用户
            </span>
            <button
              onClick={() => setShowMessageDialog(true)}
              disabled={selectedUsers.length === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              📨 发送消息
            </button>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="h-[500px] overflow-y-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">
                {searchTerm ? '🔍 没有找到匹配的用户' : '📭 暂无用户数据'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.phone}
                  user={user}
                  isSelected={selectedUsers.some(u => u.phone === user.phone)}
                  onToggleSelect={toggleUserSelection}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 消息发送对话框 */}
      <MessageDialog
        isOpen={showMessageDialog}
        selectedUsers={selectedUsers}
        onClose={() => setShowMessageDialog(false)}
        onSend={handleSendMessage}
      />
    </div>
  );
}