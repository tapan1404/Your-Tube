import users from "../Models/Auth.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const { email } = req.body;

    // 1. Validate that email is provided in the request
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // 2. Check if the user exists
        const existingUser = await users.findOne({ email });

        let user;
        if (!existingUser) {
            // User does not exist, create a new user
            try {
                user = await users.create({ email });
            } catch (createError) {
                console.error("Error creating user:", createError.message || createError);
                return res.status(500).json({ message: "Something went wrong while creating the user." });
            }
        } else {
            // User exists, use the existing one
            user = existingUser;
        }

        // 3. Generate the JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // 4. Send the response with the user and token
        res.status(200).json({ result: user, token });
    } catch (error) {
        // General error handling
        console.error("Error during login:", error.message || error);
        res.status(500).json({ message: "Something went wrong during login.", error: error.message });
    }
};
