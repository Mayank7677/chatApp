const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./lib/db");
const { Server } = require("socket.io");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const cors = require("cors");
const { io, app, server } = require("./lib/socket");

dotenv.config();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV !== "production") {
  server.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
    connectDB();
  });
}

module.exports = server;