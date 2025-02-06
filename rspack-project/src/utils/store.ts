import { create } from 'zustand'

// const useBearStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
// }))

// const useStore = create(set => ({
//     votes =0
// }))


interface VoteStore {
    votes: number
    setVotes: () => void
}

export const useStore = create<VoteStore>((set) => ({
    votes: 0,
    setVotes: () => set((state) => ({ votes: state.votes + 1 })),
}))