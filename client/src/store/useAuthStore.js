import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

let url = import.meta.env.VITE_SERVER_URL;

const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],
  step: "check",
  isSendingOTP: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      let res = await axiosInstance.get("/api/user/checkAuth");
      set({ authUser: res.data.user });

      get().connectSocket(res.data.user);
    } catch (error) {
      set({ authUser: null });
      console.log("error in checkAuth", error);
    }
  },

  login: async (email, password) => {
    try {
      let res = await axiosInstance.post("/api/user/login", {
        email,
        password,
      });
      set({ authUser: res.data.user });
      toast.success(res.data.message);

      get().connectSocket(res.data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  },

  signup: async (fullName, email, password) => {
    try {
      let res = await axiosInstance.post("/api/user/signup", {
        fullName,
        email,
        password,
      });
      set({ authUser: res.data.user });
      toast.success(res.data.message);

      get().connectSocket(res.data.user);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  logout: async () => {
    try {
      let res = await axiosInstance.get("/api/user/logout");
      set({ authUser: null });
      toast.success(res.data.message);

      get().socket.disconnect();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  },

  updateProfile: async (data) => {
    // console.log(data);
    set({ isUpdatingProfile: true });
    try {
      let res = await axiosInstance.put("/api/user/updateProfile", {
        ...data,
      });
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }finally{
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: (userData) => {
    if (!userData || get().socket?.connected) return;
    console.log("url", url);

    const newSocket = io(url, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    set({ socket: newSocket });

    newSocket.on("onlineUsers", (users) => {
      set({ onlineUsers: users });
      // console.log("onlineUsers", users);
    });
  },

  checkMailAndSendOTP: async (email) => {
    set({ isSendingOTP: true });
    let { isSendingOTP } = get();
    console.log(isSendingOTP);
    try {
      let res = await axiosInstance.post("/api/user/sendOtp", {
        email,
      });
      set({ step: "verify" });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      set({ isSendingOTP: false });
    } finally {
      set({ isSendingOTP: false });
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      let res = await axiosInstance.post("/api/user/verifyOTP", {
        email,
        otp,
      });
      set({ step: "forgot" });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  forgotPass: async (email, newPass) => {
    try {
      let res = await axiosInstance.post("/api/user/forgotPass", {
        email,
        newPass,
      });
      set({ step: "check" });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },
}));

export default useAuthStore;
