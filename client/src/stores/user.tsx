import { create } from "zustand";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface userState {
  currentGameId: string | null;
  userId: string | null;
  socket: any;
  nickname: string | null;
  loading: boolean;
  queueing: boolean;
  init: () => void;
  queue: () => void;
  unqueue: () => void;
  setNickName: (nickname: string) => void;
  setSocket: () => void;
}

export const userStore = create<userState>((set) => ({
  loading: false,
  queueing: false,
  userId: null,
  nickname: null,
  socket: null,
  currentGameId: null,
  queue: () =>{ 
    set((state) => {
      if (state.loading || state.queueing === true) return {};
      state.socket.emit("queue", state.userId, state.nickname);
      return { loading: true };
    })},
  unqueue: () =>
    set((state) => {
      if (state.loading || state.queueing === false) return {};
      state.socket.emit("unqueue");
      return { loading: true };
    }),
  setNickName: (nickname: string) => set({ nickname }),
  init: () =>
    set({
      queueing: false,
      userId: uuidv4(),
      nickname: null,
      socket: null,
      currentGameId: null,
    }),
  setSocket: () => {
    const socket = io("http://127.0.0.1:3001");
    set({ socket: socket });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("queueSuccess", (data: boolean) => {
      set({ queueing: data, loading: false });
    });
  },
}));
