const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const GetUserMess = require("./controller");

const app = express().use(body_parser.json());
const port = process.env.PORT || 8000;

const BulkSMS =
  "We are no.1 Bulk SMS service provider in India. Please select the service you want to apply for.Bulk  \n\n1. Promotional SMS \n2. Transactional SMS \n3. Sender ID";
const PromotionalSMS_1 =
  "You have selected option\n1. Promotional SMS\n\nPlease select the Quantity option.\n\nReply with option name or number (2.1 or 2.3 or 1 lack)\n\n1.1. Less then 1 lack \n1.2. 1-5 lacks \n1.3. 5-10 lacks \n1.4. More then 10 lacks";
const TransactionalSMS_2 =
  "You have selected option\n2. Transactional SMS\n\nPlease select the Quantity option.\n\nReply with option name or number (2.1 or 2.3 or 1 lack)\n\n2.1. Less then 1 lack\n2.2. 1-5 lacks\n2.3. 5-10 lacks\n2.4. More then 10 lacks";
const Last_mess = `Thanks you for your reply.😊\n\nOur support executive will get back to you very soon.`;

app.get("/", (req, res) => {
  res.send("Webhook");
});
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.MYTOKEN) {
      console.log("getWebUrl",JSON.stringify(challenge))
      res.send(challenge);
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
  }
});

app.post("/webhook", GetUserMess, (req, res) => {
  let Userbody = req.UserBody;
  // const data = JSON.stringify(bodyMess, null, 2);
  // console.log("req :-", data);
  // if (bodyMess.object) {
  //   if (
  //     bodyMess.entry &&
  //     bodyMess.entry[0].changes &&
  //     bodyMess.entry[0].changes[0].value.messages &&
  //     bodyMess.entry[0].changes[0].value.messages[0]
  //   ) {
  //     let phone_number_id =
  //       bodyMess.entry[0].changes[0].value.metadata.phone_number_id;
  //     let from = bodyMess.entry[0].changes[0].value.messages[0].from;
  //     let mess = bodyMess.entry[0].changes[0].value.messages[0].text.body;

  console.log("Userbody", JSON.stringify(Userbody));
  // console.log("from", from);
  // console.log("mess", mess);

  let data = JSON.stringify({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "text",
    text: { preview_url: false, body: mess },
  });
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    headers: {
      Authorization: process.env.API_TOKEN,
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then((response) => {
      console.log("response.data", JSON.stringify(response.data));
      res.status(200).send(true);
    })
    .catch((error) => {
      console.log(error);
      res.status(403).send(false);
    });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("webhook is listening on srver");
});
