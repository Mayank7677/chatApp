import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { CiTimer } from "react-icons/ci";
import useAuthStore from "../store/useAuthStore";
import assets from "../assets/assets";
const LoginPage = () => {
  // const [step, setStep] = useState("login"); // step: login | otp
  // const [otp, setOtp] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthStore();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    login(email, password);
  };

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%] ">
      <div
        className={`lg:grid-cols-2 backdrop-blur-xl border-2 border-neutral-500 bg-[#8185B2]/10 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative text-white `}
      >
        <section className="flex items-center justify-center  ">
          <div class="flex  gap-10   rounded-4xl py-10   items-center">
            <div class="w-full flex flex-col items-center justify-center ">
              <div className="flex items-center gap-2 ">
                <img src={assets.logo_icon} className="max-w-10" alt="" />
                <h1 className="text-3xl font-medium ">VibeRoom</h1>
              </div>
              <form
                onSubmit={handleSubmit}
                class="md:w-96 w-80 flex flex-col items-center justify-center p-5"
              >
                {/* <h2 class="text-3xl font-medium  ">Log in</h2> */}
                <p class="text-sm  mt-3 mb-6">
                  Welcome back! Please log in to continue
                </p>

                <>
                  <div class="flex items-center w-full bg-transparent border  h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <MdOutlineEmail />

                    <input
                      type="email"
                      placeholder="Email id"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      class="bg-transparent   outline-none text-sm  w-full h-full font-serif"
                      required
                    />
                  </div>

                  <div class="flex items-center mt-6 w-full bg-transparent border  h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <RiLockPasswordLine />

                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      class="bg-transparent  outline-none text-sm  w-full h-full font-serif"
                      required
                    />
                  </div>

                  <div class="w-full flex items-center justify-between mt-8 ">
                    <div class="flex items-center gap-2"></div>
                    <Link
                      class="text-sm  text-purple-500 hover:underline font-serif"
                      to="/forget"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </>

                {/* {step === "otp" && (
                  <>
                    <div class="flex items-center w-full bg-transparent border  h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <CiTimer />

                      <input
                        type="text"
                        placeholder="Enter OTP"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        class="bg-transparent  outline-none text-sm  w-full h-full font-serif"
                        required
                      />
                    </div>
                  </>
                )} */}

                <button
                  type="submit"
                  className=" py-2.5 w-full mt-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer"
                >
                  {/* {step === "login" ? "Send OTP" : "Verify OTP"} */}
                  Log in
                </button>

                {/* {step === "login" && ( */}
                <p class=" text-sm font-serif mt-4">
                  Don’t have an account?{" "}
                  <Link class=" hover:underline text-purple-500" to="/signup">
                    Create
                  </Link>
                </p>
                {/* )} */}
              </form>
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-lg:hidden">
          <img src={assets.logo_icon} className="max-w-16" alt="" />
          <p className="text-lg font-medium text-white">
            {" "}
            Chat anytime , anywhere on VibeRoom{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
