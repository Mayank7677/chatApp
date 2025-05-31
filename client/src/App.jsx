import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignupPage from "./pages/SignupPage";
import ForgetPass from "./pages/ForgetPass";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  const { authUser, checkAuth } = useAuthStore();
  console.log("authUser", authUser);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className='bg-[url("/bg-image2.avif")] bg-center'>
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />

        <Route
          path="/forget"
          element={!authUser ? <ForgetPass /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
