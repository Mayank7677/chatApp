const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
exports.getUsersForSidebar = async (req, res) => {
  try {
    let userId = req.user._id;

    const filterUsers = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");

    // number of unseen messages
    const unseenMessages = {};
    const promise = filterUsers.map(async (user) => {
      const messages = await messageModel.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promise);
    res.json({ users: filterUsers, unseenMessages });
  } catch (error) {
    console.log("error in getUsersForSIdebar", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: myId, receiverId: receiverId },
          { senderId: receiverId, receiverId: myId },
        ],
      })
      .sort({ createdAt: 1 });

    await messageModel.updateMany(
      { senderId: receiverId, receiverId: myId },
      { seen: true }
    );

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log("error in getMessages", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.markMessageAsSeen = async (req, res) => {
  console.log("gwsgww", req.params);
  try {
    const { id } = req.params;
    await messageModel.findByIdAndUpdate(id, { seen: true });
    return res.status(200).json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    console.log("error in markMessageAsSeen", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageURL;
    if (image) {
      const uploadImage = await cloudinary.uploader.upload(image);
      imageURL = uploadImage.secure_url;
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
      message: newMessage,
    });
  } catch (error) {
    console.log("error in sendMessage", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
