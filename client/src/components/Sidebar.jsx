import React, { useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import { RxCross1 } from "react-icons/rx";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, onlineUsers } = useAuthStore();
  console.log(onlineUsers);

  const { users, getUsers, selectedUser, setSelectedUser, unseenMessages } =
    useChatStore();

  useEffect(() => {
    getUsers();
  }, [getUsers, onlineUsers]);

  const [input, setInput] = useState("");
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // Sort users: online first, then offline
  const sortedUsers = [
    // Online users with unseen messages
    ...filteredUsers.filter(
      (user) => onlineUsers.includes(user._id) && unseenMessages[user._id] > 0
    ),
    // Online users without unseen messages
    ...filteredUsers.filter(
      (user) => onlineUsers.includes(user._id) && !unseenMessages[user._id]
    ),
    // Offline users with unseen messages
    ...filteredUsers.filter(
      (user) => !onlineUsers.includes(user._id) && unseenMessages[user._id] > 0
    ),
    // Offline users without unseen messages
    ...filteredUsers.filter(
      (user) => !onlineUsers.includes(user._id) && !unseenMessages[user._id]
    ),
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5  overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={assets.logo_icon} className="max-w-7" alt="" />
            <h1 className="text-lg font-medium ">VibeRoom</h1>
          </div>

          <div className="relative py-2 ">
            <span onClick={() => setOpen(!open)}>
              {open ? (
                <span className="text-xl cursor-pointer">
                  <RxCross1 />
                </span>
              ) : (
                <img
                  src={assets.menu_icon}
                  className="max-h-5 cursor-pointer"
                  alt=""
                />
              )}
            </span>
            {open && (
              <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100  ">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer text-sm"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p onClick={logout} className="cursor-pointer text-sm">
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-2 px-3 mt-5">
          <img src={assets.search_icon} className="w-3" alt="" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user"
          />
        </div>
      </div>

      {/* <div className="flex flex-col ">
        {filteredUsers.map((user, index) => {
          return (
            <div
              onClick={() => setSelectedUser(user)}
              key={index}
              className={`relative flex items-center p-2 gap-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id && "bg-[#282142]/50"
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                className="w-[35px] h-[35px] object-cover aspect-[1/1] rounded-full"
                alt=""
              />

              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-600 text-xs">Offline</span>
                )}
              </div>

              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          );
        })}
      </div> */}

      {/* ...header and search... */}
      <div className="flex flex-col ">
        {sortedUsers.map((user, index) => {
          return (
            <div
              onClick={() => setSelectedUser(user)}
              key={user._id}
              className={`relative flex items-center p-2 gap-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                selectedUser?._id === user._id && "bg-[#282142]/50"
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                className="w-[35px] h-[35px] object-cover aspect-[1/1] rounded-full"
                alt=""
              />

              <div className="flex flex-col leading-5">
                <p>{user.fullName}</p>
                {onlineUsers.includes(user._id) ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-600 text-xs">Offline</span>
                )}
              </div>

              {unseenMessages[user._id] > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                  {unseenMessages[user._id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
