import { create } from 'zustand';

// WebSocket 事件类型
export enum WebSocketEventType {
  REPO_CLONE_COMPLETED = 'COMPLETED',
  REPO_CLONE_FAILED = 'FAILED',
}

// WebSocket 事件数据结构
export interface WebSocketEvent {
  type?: WebSocketEventType;
  data?: any;
  user_id?: string;
  repo_name?: string;
  message?: string;
  repo_id?: number;
  repo_url?: string;
}

// 克隆仓库完成事件数据
export interface RepoCloneCompletedData {
  user_id: string;
  repo_name: string;
  message: string;
  repo_id?: number;
  repo_url?: string;
}

// WebSocket 状态管理
interface WebSocketStore {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  addEventHandler: (eventType: WebSocketEventType, handler: (data: any) => void) => void;
  removeEventHandler: (eventType: WebSocketEventType, handler: (data: any) => void) => void;
}

// 事件处理器映射
const eventHandlers: Record<string, ((data: any) => void)[]> = {};

// WebSocket 状态管理
export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,
  
  // 连接 WebSocket
  connect: () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // 判断是否已连接
    if (get().socket && get().isConnected) return;
    
    // 创建 WebSocket 连接
    const socket = new WebSocket(`ws://localhost:3000/api/ws/${token}`);
    
    socket.onopen = () => {
      console.log('WebSocket 连接已建立');
      set({ isConnected: true });
    };
    
    socket.onmessage = (event) => {
      try {
        const wsData = JSON.parse(event.data);
        console.log('收到 WebSocket 消息:', wsData);
        
        let eventType: WebSocketEventType | undefined;
        
        // 检查消息格式，适配后端返回的数据结构
        if (wsData.message === 'COMPLETED') {
          eventType = WebSocketEventType.REPO_CLONE_COMPLETED;
        } else if (wsData.message === 'FAILED') {
          eventType = WebSocketEventType.REPO_CLONE_FAILED;
        }
        
        if (eventType) {
          // 调用事件处理器
          console.log("调用时间处理器")
          const handlers = eventHandlers[eventType] || [];
          handlers.forEach(handler => handler(wsData));
        }
        
      } catch (error) {
        console.error('处理 WebSocket 消息出错:', error);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket 连接已关闭');
      set({ isConnected: false, socket: null });
      
      // 如果意外断开，尝试重新连接
      setTimeout(() => {
        if (!get().isConnected) {
          get().connect();
        }
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket 连接错误:', error);
    };
    
    set({ socket });
  },
  
  // 断开 WebSocket 连接
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },
  
  // 添加事件处理器
  addEventHandler: (eventType: WebSocketEventType, handler: (data: any) => void) => {
    if (!eventHandlers[eventType]) {
      eventHandlers[eventType] = [];
    }
    
    if (!eventHandlers[eventType].includes(handler)) {
      eventHandlers[eventType].push(handler);
    }
  },
  
  // 移除事件处理器
  removeEventHandler: (eventType: WebSocketEventType, handler: (data: any) => void) => {
    if (eventHandlers[eventType]) {
      eventHandlers[eventType] = eventHandlers[eventType].filter(h => h !== handler);
    }
  },
}));

// 初始化 WebSocket 连接
export const initWebSocket = () => {
  useWebSocketStore.getState().connect();
  
  // 监听登录状态变化
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      if (event.newValue) {
        useWebSocketStore.getState().connect();
      } else {
        useWebSocketStore.getState().disconnect();
      }
    }
  });
};
