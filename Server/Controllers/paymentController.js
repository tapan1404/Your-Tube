import Razorpay from 'razorpay';
import User from '../Models/user';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { amount } = req.body; // Amount for the payment

  try {
    const options = {
      amount: amount * 100,  // Amount should be in paise
      currency: 'INR',
      receipt: 'order_rcptid_11',
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Razorpay order', error });
  }
};

export const verifyPayment = async (req, res) => {
  const { paymentId, orderId, signature } = req.body;

  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                                     .update(orderId + '|' + paymentId)
                                     .digest('hex');

  if (generatedSignature === signature) {
    // Mark the user as premium after successful payment
    const userId = req.userId; // Assuming middleware to extract userId
    await User.findByIdAndUpdate(userId, { isPremium: true, plan: 'Gold' });

    res.status(200).json({ message: 'Payment successful, plan upgraded to Gold' });
  } else {
    res.status(400).json({ message: 'Invalid payment signature' });
  }
};
