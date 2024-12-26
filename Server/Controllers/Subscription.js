import User from "../Models/User.js";

export const upgradePlan = async (req, res) => {
    const { userId, plan } = req.body;

    if (!userId || !plan) {
        return res.status(400).json({ message: "User ID and plan are required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.subscriptionPlan = plan;
        await user.save();

        res.status(200).json({ message: `User upgraded to ${plan} plan`, user });
    } catch (error) {
        res.status(500).json({ message: "Error upgrading plan", error });
    }
};
