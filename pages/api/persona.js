import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const rawBody = await buffer(req);
    try {
      const data = JSON.parse(rawBody).data.attributes;
      const reqBody = {
        signature: req.headers['persona-signature'],
        userId: Number(data.payload.data.attributes['reference-id']),
        event: data.name,
        rawBody: rawBody,
      };

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          api_key: process.env.FRONTEND_API_KEY,
        },
        body: JSON.stringify(reqBody),
      };
      const fetchRes = await fetch(
        `${process.env.SERVER_URL}/services/persona`,
        fetchOptions
      );
      const resData = await fetchRes.json();

      if (resData?.data && resData?.data?.statusCode >= 400) {
        throw new Error(resData.data.message);
      }
    } catch (err) {
      res.status(400).send('');
      return;
    }
    res.json({ received: true });
  }
};

export default handler;
