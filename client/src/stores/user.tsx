import { create } from "zustand";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface userState {
  gameRoom: string | null;
  userId: string | null;
  socket: any;
  nickname: string | null;
  loading: boolean;
  queueing: boolean;
  init: () => void;
  queue: () => void;
  unqueue: () => void;
  setNickName: (nickname: string) => void;
}
function setSocket(set: Function) {
  const socket = io("http://127.0.0.1:3001", {});
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("gamestarted", (data) => {
    console.log(data);
    set({ gameRoom: JSON.parse(data) });
  });
  socket.on("queueSuccess", (data: boolean) => {
    set({ queueing: data, loading: false });
  });
  return socket;
}

export const userStore = create<userState>((set) => ({
  loading: false,
  queueing: false,
  userId: null,
  nickname: null,
  socket: null,
  gameRoom: null,
  hand: [],
  ate: [],

  queue: () => {
    set((state) => {
      if (state.loading || state.queueing === true) return {};
      state.socket.emit("queue", state.userId, state.nickname);
      return { loading: true };
    });
  },
  unqueue: () =>
    set((state) => {
      if (state.loading || state.queueing === false) return {};
      state.socket.emit("unqueue");
      return { loading: true };
    }),
  setNickName: (nickname: string) => set({ nickname }),
  init: () =>
    set({
      userId: uuidv4(),
      socket: setSocket(set),
      nickname: null,
      gameRoom: null,
      queueing: false,
    }),
}));
