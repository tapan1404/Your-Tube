import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http"; // Import HTTP for WebSocket integration
import { Server } from "socket.io"; // Import Socket.IO
import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import subscriptionRoutes from './Routes/Subscription.js'; // Subscription routes
import path from 'path';
import commentroutes from './Routes/comment.js';
import Chat from './Models/Chat.js'; // Import Chat model

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware for cross-origin requests
app.use(cors());

// Body parsers for JSON and URL encoding
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join('uploads')));

// Basic route to check server status
app.get('/', (req, res) => {
    res.status(200).json({ message: "Your Tube is working" });
});

// Routes for user, video, comment, and subscription
app.use('/user', userroutes);
app.use('/video', videoroutes);
app.use('/comment', commentroutes);
app.use('/subscription', subscriptionRoutes); // Add subscription route

// Set the port for the server
const PORT = process.env.PORT || 5000;

// Create an HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Adjust to match your frontend URL
        methods: ["GET", "POST"],
    },
});

// WebSocket handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle joining a chat room
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ roomId, message, userId, username }) => {
        try {
            if (!message || !roomId || !username || !userId) {
                console.error("Missing required fields for sending message");
                return;
            }

            const chat = await Chat.findOneAndUpdate(
                { roomId },
                { $push: { messages: { userId, text: message, username, timestamp: new Date() } } },
                { upsert: true, new: true }
            );

            io.to(roomId).emit("receiveMessage", {
                userId,
                username,
                text: message,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    // Emit event when a plan is upgraded
    socket.on("upgradePlan", (data) => {
        const { userId, plan } = data;
        io.emit("planUpgraded", { userId, plan });
        console.log(`User ${userId} upgraded to ${plan}`);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// MongoDB connection
const DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL)
    .then(() => {
        console.log("MongoDB Database connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });

// Graceful shutdown on server termination
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
});

// Start the server with WebSocket support
server.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});
