import React, { useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const RightSidebar = () => {
  const { messages , selectedUser } = useChatStore();
  const { logout, onlineUsers } = useAuthStore();
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  return (
    <div
      className={` bg-[#8185b2]/10 text-white w-full relative overflow-y-scroll ${
        selectedUser ? "max-md:hidden" : ""
      } `}
    >
      <div className="pt-16 flex flex-col items-center gap-2 text-xs mx-auto font-light ">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className="w-20 h-20 object-cover aspect-[1/1] rounded-full"
          alt=""
        />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <p className="h-2 w-2 rounded-full bg-green-500"></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto "> {selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      <div className="px-5 text-xs ">
        <p>Media</p>

        <div className="mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80 ">
          {msgImages.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className="cursor-pointer rounded"
            >
              <img src={url} className="h-full rounded-md" alt="" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => logout()}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
