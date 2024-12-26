// models/User.js

import mongoose from 'mongoose';

const userschema = mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String },
    desc: { type: String },
    joinedon: { type: Date, default: Date.now },
    plan: { type: String, default: 'Free' }, // Free, Bronze, Silver, Gold
    totalWatchTime: { type: Number, default: 0 }, // Total watch time in minutes
});

const User = mongoose.models.User || mongoose.model('User', userschema);

export default User;
