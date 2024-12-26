import express from 'express';
import { downloadVideo } from '../Controllers/downloadController';

const router = express.Router();

// Download video
router.post('/download', downloadVideo);

export default router;
