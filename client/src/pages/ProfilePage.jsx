import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import assets from "../assets/assets";
import { FiMessageSquare } from "react-icons/fi";
import { BsFillCameraFill } from "react-icons/bs";
import useAuthStore from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { updateProfile, authUser, isUpdatingProfile } = useAuthStore();
  let navigate = useNavigate();

  const [fullName, setFullName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      await updateProfile({ fullName, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      let res = await updateProfile({ fullName, bio, profilePic: base64Image });
      navigate("/");
    };
  };

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] ">
      <div
        className={`backdrop-blur-xl border-2 border-neutral-500 bg-[#8185B2]/10 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative text-white `}
      >
        <section className="flex items-center justify-center  ">
          <div class="flex  gap-10   rounded-4xl py-10   items-center">
            <div class="w-full flex flex-col items-center justify-center ">
              <form
                onSubmit={handleSubmit}
                class="md:w-96 w-80 flex flex-col items-center justify-center p-5"
              >
                <h2 class="text-3xl font-medium text-white mb-6">
                  Edit Profile
                </h2>

                <>
                  <div className="relative">
                    <label
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                      htmlFor="avatar"
                      className="flex items-center gap-3 cursor-pointer "
                    >
                      <input type="file" id="avatar" accept="image/*" hidden />
                      <img
                        src={
                          selectedImage
                            ? URL.createObjectURL(selectedImage)
                            : authUser?.profilePic || assets.avatar_icon
                        }
                        className={`w-22 h-22 object-cover rounded-full ${
                          selectedImage && "rounded-full"
                        }`}
                        alt=""
                      />
                    </label>

                    <p className="text-lg absolute right-1 -bottom-1 ">
                      <BsFillCameraFill />
                    </p>
                  </div>

                  <div class="flex items-center mt-6 w-full bg-transparent border  h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <p className="text-sm">
                      <FaRegUser />
                    </p>

                    <input
                      type="text"
                      placeholder="Full Name"
                      name="fullName"
                      onChange={(e) => setFullName(e.target.value)}
                      value={fullName}
                      class="bg-transparent   outline-none text-sm  w-full h-full font-serif"
                      required
                    />
                  </div>

                  <div class="flex mt-6 w-full bg-transparent border rounded-3xl overflow-hidden pl-5 gap-2">
                    <p className="py-4">
                      <FiMessageSquare />
                    </p>

                    <textarea
                      className="w-full py-2 outline-none pr-4 resize-none"
                      placeholder="Bio"
                      onChange={(e) => setBio(e.target.value)}
                      value={bio}
                      rows={5}
                      name=""
                      id=""
                    ></textarea>
                  </div>
                </>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className=" py-2.5 w-full mt-6 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer"
                >
                  {
                    isUpdatingProfile
                      ? "Updating Profile..."
                      : "Update Profile"
                  }
                </button>
                <p class=" text-sm font-serif mt-4">
                  back to Home page .{" "}
                  <Link class=" hover:underline text-purple-500" to="/">
                    Back
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
