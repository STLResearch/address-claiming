// todo: Add documentation

// Proxy URL: ${frontendHttp}/api/proxy
const handler = async (req, res) => {
  try {
    console.log(req)
    console.log("This is the request body", req.body)
    
    
    const method = req.method

    console.log("This is the method", method)

    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        // api_key: process.env.FRONTEND_API_KEY,
        api_key: "XXX",
      }
    };

    // todo: somehow prevent the user to call unexistent routes or w/ the wrong method
    if (method !== "GET" && method !== "HEAD") {
      const requestBody = JSON.stringify(req.body);
      fetchOptions.body = requestBody;
    }

    console.log("This is the server URL", process.env.SERVER_URL);

    const fetchRes = await fetch(
      `${process.env.SERVER_URL}${req.headers.uri}`,
      fetchOptions
    );

    const resData = await fetchRes.json();
    console.log("This is data from the backend", resData);

    if (resData?.data && resData?.data?.statusCode >= 400) {
      throw new Error(resData.data.message);
    }

    return res.json(resData);
  } catch (err) {
    // todo: return error from backend server
    console.error("This is error message from the backend", err.message);
    return res.status(500).json({ ok: false, errorMessage: err.message });
  }
};

export default handler;
