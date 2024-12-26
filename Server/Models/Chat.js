import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    roomId: { type: String, required: true },
    messages: [
        {
            userId: { type: String, required: true },
            username: { type: String, required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
