import express from "express"
import cors from "cors";
import { BetterPay } from "better-pay";
import * as dotenv from "dotenv"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new BetterPay({
  provider: 'dodopayments',
  apiKey: process.env.API_KEY,
  isLiveMode: false
});


app.post("/create", async (req, res) => {
  const data = req.body;
  const response = await provider.createPayment({
    amount: data.amount,
    currency: data.currency,
    email: data.email,
    name: data.name
  });
  
  res.json({
    message: response
  })
});


app.post("/confirm", async (req, res) => {
  const data = req.body;

    const response = await provider.confirmPayment({
      customerId: data.customerId,
      productId: data.productId,
      city: data.city,
      countryIsoCode: data.countryIsoCode,
      state: data.state,
      street: data.street,
      zipCode: data.zipCode,
      paymentLink: data.paymentLink,
      returnUrl: data.returnUrl,
    });

    return res.json({ message: response });
  
});



app.listen(4000, () => {
  console.log("running");
})




