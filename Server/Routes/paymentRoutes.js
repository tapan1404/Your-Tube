import React from 'react';
import axios from 'axios';

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      // 1. Create order via backend
      const { data } = await axios.post('http://localhost:5000/api/payment/create-order', { amount: 500 });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: 500 * 100, // Amount in paise
        currency: 'INR',
        name: 'YourApp',
        description: 'Premium Subscription',
        order_id: data.orderId,
        handler: async (response) => {
          // 2. Verify payment after successful transaction
          const verifyData = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          };

          const verifyResponse = await axios.post('http://localhost:5000/api/payment/verify-payment', verifyData);
          alert(verifyResponse.data.message);
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        notes: {
          address: 'Your address',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment creation failed:', error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentButton;
