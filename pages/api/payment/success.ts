// api/payment/success.ts

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const {
                orderCreationId,
                razorpayPaymentId,
                razorpayOrderId,
                razorpaySignature,
            } = req.body;

            const shasum = crypto.createHmac("sha256", "FueNjPdi4HymnGjbJARDzJqB");

            shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

            const digest = shasum.digest("hex");

            if (digest !== razorpaySignature)
                return res.status(400).json({ msg: "Transaction not legit!" });

            res.status(200).json({
                msg: "success",
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
            });
        } catch (error) {
            console.error("Error in POST /api/payment/success:", error);
            res.status(500).json({ msg: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ msg: "Method Not Allowed" });
    }
}