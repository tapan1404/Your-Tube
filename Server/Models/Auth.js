import mongoose from "mongoose";

// Define the User schema
const userschema = mongoose.Schema({
    email: { type: String, required: true },    // User's email (required)
    name: { type: String },                      // User's name (optional)
    desc: { type: String },                      // Description (optional)
    joinedon: { type: Date, default: Date.now }  // Date when the user joined (default to current date)
});

// Export the model
export default mongoose.model("User", userschema);
