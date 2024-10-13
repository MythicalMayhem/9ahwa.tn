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
  endGameData: any,

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
function setSocket(set: (Function)) {
  const socket = io("http://127.0.0.1:3001", {});
  socket.on("gamestarted", (data) => {
    console.log("gamestarted", data);
    set((state: any) => ({
      gameRoom: {
        ...state.gameRoom,
        ...data,
      },
    }));
  });

  socket.on("gamedata", (data) => {
    console.log('dataaa', data);
    set((state: any) => ({
      gameRoom: {
        ...state.gameRoom,
        ...data,
      },
    }));
  });
  socket.on("gameend", (data) => {
    console.log("gameEnded", data);
    set({ endGameData:   data   })
  })
  socket.on("queueSuccess", (data: boolean) => set({ queueing: data, loading: false }));
  socket.on("hand", (data) => set((state: any) => ({ gameRoom: { ...state.gameRoom, hand: data } })));

  return socket;
}
const initialState = {
  loading: false,
  queueing: false,
  userId: null,
  nickname: null,
  socket: null,
  gameRoom: null,
  endGameData: null,
}
export const userStore = create<userState>((set) => ({
  ...initialState,
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
          ...initialState,
          userId: uuidv4(),
          socket: setSocket(set),

        };
      }
      return {
        ...initialState,
        userId: uuidv4(),
      };
    }),
  sendPlay: (str: string) => set((state) => state.socket?.emit("play", state.gameRoom?.id, state.userId, str))
}));
