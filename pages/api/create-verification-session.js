const handler = async (req, res) => {
    if(req.method === "POST") {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        try {
            const verificationSession =
            await stripe.identity.verificationSessions.create({
                type: "document",
                metadata: {
                user_id: 1,
                }
            });
        
            // Send publishable key and PaymentIntent details to client
            // res.redirect(303, verificationSession.url);
            let url = {
                redirectUrl: verificationSession.url
            };
            res.send(url);
        } catch (e) {
            console.log("error");
            return res.status(400).send({
            error: {
                message: e.message,
            },
            });
        }
    }
}

// export default handler;
export default handler;