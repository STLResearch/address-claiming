// todo: Add documentation

// Proxy URL: ${frontendHttp}/api/proxy
const handler = async (req, res) => {
  try {
    const method = req.method;
    const { sign, time, nonce, address } = req.headers;
    console.log('This is the headers', req.headers);
    console.log('This is the signature', sign);
    console.log('This is the issue time', time);
    console.log('This is the nonce', nonce);
    console.log('This is the sign address', address);

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

    console.log('This is the fetch option', fetchOptions);

    // todo: somehow prevent the user to call unexistent routes or w/ the wrong method
    if (method !== 'GET' && method !== 'HEAD') {
      console.log('-------------------');
      console.log("reqq bodyy",req.body)
      const requestBody = JSON.stringify(req.body);
      fetchOptions.body = requestBody;
    }

    console.log('This is the server URL', process.env.SERVER_URL);

    const fetchRes = await fetch(
      `${process.env.SERVER_URL}${req.headers.uri}`,
      fetchOptions
    );

    console.log('response from the server', fetchRes);

    const resData = await fetchRes.json();

    console.log('response from the server', fetchRes);

    console.log('This is data from the backend', resData);

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
