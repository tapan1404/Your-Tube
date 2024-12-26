import mongoose from 'mongoose';

const videoSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    file: { type: String, required: true },  // This would be the file path or URL
    createdAt: { type: Date, default: Date.now },
    downloadLink: { type: String }, // URL to the video for download
});

const Video = mongoose.models.Video || mongoose.model('Video', videoSchema);

export default Video;
