import React, { use, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const scrollEnd = useRef();
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null); 

  const { onlineUsers, authUser } = useAuthStore();
console.log(onlineUsers);
  const {
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedUser,
    messages,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useChatStore();

  useEffect(() => {
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages, selectedUser]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    if (imagePreview) {
      await sendMessage({ image: imagePreview, text: input.trim() });
      setImagePreview(null);
      setInput("");
      return;
    }

    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // const handleSendImage = async (e) => {
  //   const file = e.target.files[0];

  //   if (!file || !file.type.startsWith("image/")) {
  //     toast.error("Please select an image file.");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     await sendMessage({ image: reader.result });
  //     e.target.value = null;
  //   };

  //   reader.readAsDataURL(file);
  // };
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    console.log(file)

    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // <-- Just set preview, don't send yet
      e.target.value = null;
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* header section  */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-10 h-10 object-cover rounded-full"
          alt=""
        />

        <p className="flex-2 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="cursor-pointer max-w-7 "
          alt=""
        />
        {/* <img src={assets.help_icon} className="max-md:hidden max-w-5 " alt="" /> */}
      </div>
      {/* message section  */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                alt=""
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-[#282142]/50 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}

            <div ref={scrollEnd}></div>

            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                className="w-7 h-7 object-cover rounded-full"
                alt=""
              />

              <p className="text-gray-500">
                {" "}
                {formatMessageTime(msg.createdAt)}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* input section  */}
      {/* <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className=" flex-1 flex items-center bg-gray-100/12 px-3 rounded-full ">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none  text-white placeholder-gray-400"
          />

          <input
            onChange={(e) => handleSendImage(e)}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={(e) => handleSendMessage(e)}
          src={assets.send_button}
          className="w-7 cursor-pointer"
          alt=""
        />
      </div> */}

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-3">
        {/* Image preview */}
        {imagePreview && (
          <div className="flex items-center gap-2 mb-2">
            <img
              src={imagePreview}
              alt="preview"
              className="max-h-24 max-w-24 rounded border"
            />
            <button
              onClick={handleRemoveImage}
              className="text-red-500 text-xs px-2 py-1 border border-red-500 rounded"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex flex-1 items-center bg-gray-100/12 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none  text-white placeholder-gray-400"
          />

          <input
            onChange={handleSelectImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>

          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            className="w-7 cursor-pointer"
            alt=""
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">
        {" "}
        Chat anytime , anywhere on VibeRoom{" "}
      </p>
    </div>
  );
};

export default ChatContainer;
