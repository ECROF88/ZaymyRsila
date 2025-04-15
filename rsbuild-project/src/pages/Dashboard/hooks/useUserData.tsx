import { getUserData } from "@/utils/api";
import type { UserData } from "@/utils/store";
import { create } from "zustand";

const initialState: UserData = {
	username: "",
	email: "",
	avatar: undefined,
};
export const useUserStore = create<{
	userData: UserData;
	updateUserData: (newData: Partial<UserData>) => void;
	resetUserData: () => void;
	fetchUserData: () => void;
}>((set) => ({
	userData: initialState, // 初始状态
	updateUserData: (newData: Partial<UserData>) =>
		set((state) => ({
			userData: { ...state.userData, ...newData }, // 更新部分字段
		})),
	resetUserData: () =>
		set(() => ({
			userData: initialState, // 重置为初始状态
		})),

	fetchUserData: async () => {
		const response = await getUserData();
		console.log(response);
		if (response && response.data && response.data.data) {
			set((state) => ({
				userData: { ...state.userData, ...response.data.data },
			}));
		} else {
			throw new Error(response?.data?.message || "获取用户信息失败");
		}
	},
}));
