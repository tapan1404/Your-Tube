import User from '../Models/user';
import Video from '../Models/Video';

export const downloadVideo = async (req, res) => {
  const userId = req.userId;  // Assuming you have middleware to extract the user ID
  const videoId = req.body.videoId;

  try {
    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user is a free plan user
    const today = new Date().setHours(0, 0, 0, 0);
    const lastDownloadDate = user.lastDownloadDate ? new Date(user.lastDownloadDate).setHours(0, 0, 0, 0) : null;

    if (user.plan === 'Free' && lastDownloadDate === today) {
      return res.status(403).json({ message: 'You can only download one video per day. Upgrade to premium for more downloads.' });
    }

    if (user.plan === 'Free') {
      user.lastDownloadDate = new Date();
      await user.save();
    }

    // Logic to serve the video download link
    res.status(200).json({ message: 'Download successful', downloadLink: video.downloadLink });

  } catch (error) {
    res.status(500).json({ message: 'Error downloading video', error });
  }
};
