const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "users",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("messages", messageSchema);
