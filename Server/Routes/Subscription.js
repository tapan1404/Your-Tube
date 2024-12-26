import express from 'express';
import { upgradePlan } from '../Controllers/Subscription.js'; // Assuming you have a controller for handling subscription logic

const router = express.Router();

// Route for upgrading the user's plan
router.post('/upgrade', upgradePlan);

export default router;
