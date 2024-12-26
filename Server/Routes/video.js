import express from "express";
import { likevideocontroller } from "../Controllers/like.js";
import { viewscontroller } from "../Controllers/views.js";
import { uploadvideo, getallvideos } from "../Controllers/video.js";
import { historycontroller, deletehistory, getallhistorycontroller } from "../Controllers/History.js";
import { watchlatercontroller, getallwatchlatervontroller, deletewatchlater } from "../Controllers/watchlater.js";
import { likedvideocontroller, getalllikedvideo, deletelikedvideo } from "../Controllers/likedvideo.js";
import upload from "../Helper/filehelper.js";
import auth from "../middleware/auth.js";

const routes = express.Router();

// Video Upload & Management
routes.post("/uploadvideo", auth, upload.single("file"), uploadvideo);
routes.get("/getvideos", getallvideos);

// Like & View Video
routes.patch('/like/:id', auth, likevideocontroller);
routes.patch('/view/:id', viewscontroller);

// Video History Routes
routes.post('/history', auth, historycontroller);
routes.get('/getallhistory', getallhistorycontroller);
routes.delete('/deletehistory/:userid', auth, deletehistory);

// Watch Later Routes
routes.post('/watchlater', auth, watchlatercontroller);
routes.get('/getallwatchlater', getallwatchlatervontroller);
routes.delete('/deletewatchlater/:videoid/:viewer', auth, deletewatchlater);

// Liked Video Routes
routes.post('/likevideo', auth, likedvideocontroller);
routes.get('/getalllikevide', getalllikedvideo);
routes.delete('/deletelikevideo/:videoid/:viewer', auth, deletelikedvideo);

// VoIP & Screen Sharing Routes
// Initiate a video call with another user (signaling)
routes.post('/initiate-call', auth, (req, res) => {
    // Logic to initiate the video call
    // Will use WebSocket (socket.io) to signal the other user
    res.send({ message: "Video call initiated" });
});

// Screen Sharing Start
routes.post('/start-screen-share', auth, (req, res) => {
    // Logic to initiate screen sharing
    res.send({ message: "Screen sharing started" });
});

// Screen Sharing Stop
routes.post('/stop-screen-share', auth, (req, res) => {
    // Logic to stop screen sharing
    res.send({ message: "Screen sharing stopped" });
});

// Record Video Session
routes.post('/start-recording', auth, (req, res) => {
    // Logic to start recording the video session
    res.send({ message: "Recording started" });
});

routes.post('/stop-recording', auth, (req, res) => {
    // Logic to stop the video recording
    res.send({ message: "Recording stopped and saved" });
});

export default routes;
