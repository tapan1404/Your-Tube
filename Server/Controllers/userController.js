const upgradePlan = async (req, res) => {
    const { userId, plan } = req.body;
    const plans = { Bronze: 10, Silver: 50, Gold: 100 };
  
    if (!plans[plan]) return res.status(400).json({ message: 'Invalid plan' });
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.plan = plan;
      user.planExpiry = plan === 'Gold' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();
  
      // Optionally, trigger an email notification here
  
      res.status(200).json({ message: `Successfully upgraded to ${plan} plan.` });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upgrade plan.' });
    }
  };
  
  module.exports = { upgradePlan };
  