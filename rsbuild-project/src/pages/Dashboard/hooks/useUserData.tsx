import { getUserData } from "@/utils/api";
import type { UserData } from "@/utils/store";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState: UserData = {
	username: "",
	email: "",
	avatar: undefined,
};

interface UserStore {
	userData: UserData;
	updateUserData: (newData: Partial<UserData>) => void;
	resetUserData: () => void;
	fetchUserData: () => Promise<void>;
	loading?: boolean;
	error?: string | null;
}

export const useUserStore = create<UserStore>()(
	devtools(
		(set) => ({
			userData: initialState,
			updateUserData: (newData: Partial<UserData>) =>
				set((state) => ({
					userData: { ...state.userData, ...newData },
				})),

			resetUserData: () =>
				set(() => ({
					userData: initialState,
				})),

			fetchUserData: async () => {
				set({ loading: true, error: null });
				try {
					const response = await getUserData();
					if (response && response.data && response.data.data !== null) {
						set({
							userData: response.data.data,
							loading: false,
						});
						console.log(response.data.data.avatar)
					} else {
						throw new Error(response?.data?.message || "获取用户信息失败");
					}
				} catch (error) {
					console.error("获取用户数据失败:", error);
					set({
						error: error instanceof Error ? error.message : "获取用户信息失败",
						loading: false,
					});
					throw error; // 重新抛出错误以便上层组件捕获
				}
			},
		}),
		{ name: "user-store" },
	),
);
