import { create } from "zustand";
import useAuthStore from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  unseenMessages: {},

  getUsers: async () => {
    try {
      let res = await axiosInstance.get("/api/message/getUsersForSidebar");

      set({ users: res.data.users });
      set({ unseenMessages: res.data.unseenMessages });
    } catch (error) {
      console.log("error in getUsers", error);
    }
  },

  getMessages: async (userId) => {
    try {
      let res = await axiosInstance.get(`/api/message/getMessages/${userId}`);

      set({ messages: res.data.messages });
    } catch (error) {
      console.log("error in getMessages", error);
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();

    try {
      let res = await axiosInstance.post(
        `/api/message/sendMessage/${selectedUser._id}`,
        data
      );

      if (res.data.success) {
        set({ messages: [...messages, res.data.message] });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("error in sendMessage", error);
      toast.error(error?.response?.data?.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) return;

    // Remove previous listener to avoid duplicates
    socket.off("newMessage");

    socket.on("newMessage", (message) => {
      const selectedUser = get().selectedUser; // always get latest

      console.log("newMessage", message);
      console.log("selectedUser", selectedUser);

      if (selectedUser && selectedUser._id === message.senderId) {
        message.seen = true;

        set((state) => ({
          messages: [...state.messages, message],
        }));

        console.log("working ----------------------------");
        axiosInstance.put(`/api/message/markAsSeen/${message._id}`);
      } else {
        set((state) => ({
          unseenMessages: {
            ...state.unseenMessages,
            [message.senderId]: state.unseenMessages[message.senderId]
              ? state.unseenMessages[message.senderId] + 1
              : 1,
          },
        }));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) =>
    set({ selectedUser, messages: [], unseenMessages: {} }),
}));

export default useChatStore;
