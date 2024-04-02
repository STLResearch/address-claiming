import axios from 'axios';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {

        if (req.query.callerAddress){

            const { sign, time, nonce, address } = req.headers;

            const response = await axios.get(`${process.env.SERVER_URL}/private/airspace-rental/retrieve-tokens`, {
                params: {
                    callerAddress: req.query.callerAddress,
                    type: req.query.type,
                    limit: req.query.limit,
                    afterAssetId: req.query.afterAssetId
                },
                headers: {
                    'Content-Type': 'application/json',
                    api_key: process.env.FRONTEND_API_KEY,
                    sign: sign,
                    sign_issue_at: time,
                    sign_nonce: nonce,
                    sign_address: address
                }
            });
            
          return res.status(200).send(response.data);
        }
    } catch (error) {
      console.log(error)
      return res.status(400).send({ error });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;
