// api/payment/success.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.send("API Working hooray");
    } else {
        res.status(405).json({ msg: "Method Not Allowed" });
    }
}
