const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");

const app = express().use(body_parser.json());
const port = process.env.PORT || 8000;
const my_token = process.env.MYTOKEN;
const API_token = process.env.API_TOKEN;

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
    if (mode === "subscribe" && token === my_token) {
      res.send(challenge);
    } else {
      res.status(403);
    }
  } else {
    res.status(403);
  }
});

app.post("/webhook", (req, res) => {
  let bodyMess = req.body;
  const data = JSON.stringify(bodyMess, null, 2);
  console.log("req :-", data);
  if (bodyMess.object) {
    if (
      // bodyMess.entry &&
      // bodyMess.entry[0].changes &&
      // bodyMess.entry[0].changes[0].value.messages &&
      bodyMess.entry[0].changes[0].value.messages[0]
    ) {
      const phone_number_id =
        bodyMess.entry[0].changes[0].value.metadata.phone_number_id;
      const from = bodyMess.entry[0].changes[0].value.messages[0].from;
      const mess = bodyMess.entry[0].changes[0].value.messages[0].text.body;

      console.log("phone_number_id", phone_number_id);
      console.log("from", from);
      console.log("mess", mess);

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
          Authorization:
            "Bearer EAAWqeZCMrJ6sBO0txUZBVzTy8PKfE9PCMTOawGLKsYkYZBy05KZBNXkAe1VNFyBWRkDsUDqeRhpRaV7x4Ifeges7IXvAMhWhvYSCoHQFmBhnL2tEQBkCZBZCn6CFZAeHFaqh6Ua1W14IyG0nzDSXiVxC0vdzMMiEJZBBwafhwZBjgsEOUFRuRO5FZAnh72QEwi9NGGj7iRQS82HPzoYwsxUK9ssjiU79FUf8XD",
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log("webhook is listening on srver");
});
