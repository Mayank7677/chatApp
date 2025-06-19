import React, { useState } from "react";
import { CiTimer } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import assets from "../assets/assets";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const { step, forgotPass, checkMailAndSendOTP, verifyOTP, isSendingOTP } =
    useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === "check") {
      await checkMailAndSendOTP(email);
    } else if (step === "verify") {
      await verifyOTP(email, otp);
    } else if (step === "forgot") {
      await forgotPass(email, password);
    }
  };
  return (
    <div className="sm:border w-full h-screen sm:px-[15%] sm:py-[5%] ">
      <div
        className={`backdrop-blur-xl lg:grid-cols-2 sm:border-2 border-neutral-500 bg-[#8185B2]/10 sm:rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative text-white `}
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
                {/* <h2 class="text-3xl font-medium  ">Forgot Password</h2> */}
                <p class="text-sm  mt-3 mb-6 ">
                  Enter your email and verify OTP to reset your password
                </p>

                {step === "check" && (
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
                  </>
                )}

                {step === "verify" && (
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
                )}
                {step === "forgot" && (
                  <>
                    <div class="flex items-center mt-6 w-full bg-transparent border  h-12 rounded-full overflow-hidden pl-6 gap-2">
                      <RiLockPasswordLine />

                      <input
                        type="password"
                        placeholder="New Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        class="bg-transparent  outline-none text-sm  w-full h-full font-serif"
                        required
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSendingOTP}
                  className=" py-2.5 w-full mt-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light rounded-full cursor-pointer"
                >
                  {step === "check"
                    ? isSendingOTP
                      ? "Sending OTP..."
                      : "Send OTP"
                    : step === "verify"
                    ? "Verify OTP"
                    : "Change Password"}
                </button>

                {step === "check" && (
                  <p class=" text-sm font-serif mt-4">
                    back to Login page .{" "}
                    <Link class=" hover:underline text-purple-500" to="/login">
                      Back
                    </Link>
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {step === "check" && (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-lg:hidden">
            <img src={assets.logo_icon} className="max-w-16" alt="" />
            <p className="text-lg font-medium text-white">
              {" "}
              Chat anytime , anywhere on VibeRoom{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPass;
