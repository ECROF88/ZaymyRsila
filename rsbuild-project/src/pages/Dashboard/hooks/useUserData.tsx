import type { UserData } from '@/utils/store'
import { create } from 'zustand'

const initialState: UserData = {
  name: '',
  email: '',
  avatar: undefined,
}
export const useUserStore = create<{
  userData: UserData
  updateUserData: (newData: Partial<UserData>) => void
  resetUserData: () => void
}>(set => ({
      userData: initialState, // 初始状态
      updateUserData: (newData: Partial<UserData>) =>
        set(state => ({
          userData: { ...state.userData, ...newData }, // 更新部分字段
        })),
      resetUserData: () =>
        set(() => ({
          userData: initialState, // 重置为初始状态
        })),
    }))
