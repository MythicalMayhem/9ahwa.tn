import { create } from "zustand";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

interface userState {
  gameRoom: {
    id: number;
    players: Array<string>;
    ground: Array<string>;
    hand: [];
    turn: number;
  } | null;
  userId: string | null;
  socket: any;
  nickname: string | null;
  loading: boolean;
  queueing: boolean;
  init: () => void;
  sendPlay: (str: string) => void;
  queue: (name: string) => void;
  unqueue: () => void;
  setNickName: (nickname: string) => void;
}
function setSocket(set: Function) {
  console.log("new socket");
  const socket = io("http://127.0.0.1:3001", {});
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("gamestarted", (data) => {
    console.log("gamestarted", data);
    set((state: any) => ({
      gameRoom: {
        ...state.gameRoom,
        ...(data),
      },
    }));
  });
  socket.on("gamedata", (data) => {
    console.log("gamedata", data);
    set((state: any) => ({
      gameRoom: {
        ...state.gameRoom,
        ...(data),
      },
    }));
  });
  socket.on("queueSuccess", (data: boolean) => {
    set({ queueing: data, loading: false });
  });
  socket.on("hand", (data) => {
    console.log("hand", data);

    set((state: any) => ({ gameRoom: { ...state.gameRoom, hand: data } }));
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
  ate: [],

  queue: (name) => {
    set((state) => {
      if (state.loading || state.queueing === true) return {};
      state.socket.emit("queue", state.userId, state.nickname || name);
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
    set((state) => {
      if (!state.socket) {
        return {
          userId: uuidv4(),
          socket: setSocket(set),
          nickname: null,
          gameRoom: null,
          queueing: false,
        };
      }
      return {
        userId: uuidv4(),
        nickname: null,
        gameRoom: null,
        queueing: false,
      };
    }),
  sendPlay: (str: string) => {
    console.log(str);
    set((state) => {
      console.log(state.gameRoom?.id);
      state.socket?.emit("play", state.gameRoom?.id, state.userId, str);
      return {};
    });
  },
}));
