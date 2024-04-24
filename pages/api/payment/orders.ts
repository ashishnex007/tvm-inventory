// api/payment/orders.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { totalBill } = req.body;

            const instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_SS49Ahe904DIC8",
                key_secret: process.env.RAZORPAY_SECRET,
            });

            const options = {
                amount: totalBill * 100, // amount in smallest currency unit
                currency: "INR",
                receipt: "receipt_order_74394",
            };

            const order = await instance.orders.create(options);

            if (!order) return res.status(500).json({ msg: "Some error occurred" });

            res.status(200).json(order);
        } catch (error) {
            console.error("Error in POST /api/payment/orders:", error);
            res.status(500).json({ msg: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ msg: "Method Not Allowed" });
    }
}