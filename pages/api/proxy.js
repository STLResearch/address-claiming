// todo: Add documentation

// Proxy URL: ${frontendHttp}/api/proxy
const handler = async (req, res) => {
  try {
    const method = req.method;
    const { sign, time, nonce, address } = req.headers;

    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        api_key: process.env.FRONTEND_API_KEY,
        sign: sign,
        sign_issue_at: time,
        sign_nonce: nonce,
        sign_address: address,
      },
    };



    // todo: somehow prevent the user to call unexistent routes or w/ the wrong method
    if (method !== 'GET' && method !== 'HEAD') {

      const requestBody = JSON.stringify(req.body);
      fetchOptions.body = requestBody;
    }



    const fetchRes = await fetch(
      `${process.env.SERVER_URL}${req.headers.uri}`,
      fetchOptions
    );



    const resData = await fetchRes.json();

 

    if (resData?.data && resData?.data?.statusCode >= 400) {
      throw new Error(resData.data.message);
    }

    return res.json(resData);
  } catch (err) {
    // todo: return error from backend server
    return res.status(500).json({ ok: false, errorMessage: err.message });
  }
};

export default handler;
