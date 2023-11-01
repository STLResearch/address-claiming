import { buffer } from "micro";

export const config = {
    api: {
        bodyParser: false,
    }
}

const handler = async (req, res) => {
    if(req.method === "POST") {
        const rawBody = await buffer(req);
        console.log("referenceId => ", JSON.parse(rawBody).data.attributes.payload.data.attributes['reference-id']);
        console.log("event => ",JSON.parse(rawBody).data.attributes.name);
        console.log("signature => ", req.headers['persona-signature']);

        try {
            const data = JSON.parse(rawBody).data.attributes;
            const reqBody = {
              signature: req.headers['persona-signature'],
              userId: Number(data.payload.data.attributes['reference-id']),
              event: data.name,
              rawBody: rawBody
            }
            // console.log(reqBody);
            const fetchOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                api_key: process.env.FRONTEND_API_KEY,
                // proxy_to_method: "POST",
              },
              body: JSON.stringify(reqBody)
            };
            const fetchRes = await fetch(
              `${process.env.SERVER_URL}/services/persona`,
              fetchOptions
            );
            const resData = await fetchRes.json();
            console.log("This is the response from the fetch call to the backend", resData)

              if (resData?.data && resData?.data?.statusCode >= 400) {
                throw new Error(resData.data.message);
              }
          } catch (err) {
            let message = "Unknown Error";
            if (err instanceof Error) message = err.message;
            res.status(400).send(`Webhook Error: ${message}`);
            return;
          }
          res.json({ received: true });
    }
}

export default handler;