const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Server } = require('socket.io');  // Import the Server class from socket.io
const GetUserMess = require("./controller");

// Create an Express app and configure it to use JSON parsing for requests
const app = express().use(bodyParser.json());

// Start the Express server on port 8000
const server = app.listen(8000, () => {
  console.log("webhook is listening on server", 8000);
});

// Create a Socket.IO instance and configure it to allow connections from client URL
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Handle Socket.IO connections and disconnections
io.on('connection', (socket)=> {
  console.log("a user connection");
  socket.on('disconnect' ,()=>{
    console.log("user disconnect");
  });
});

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
  io.emit('message', Userbody);
  res.status(200).send(true);
});




// console.log("Userbody",JSON.stringify(Userbody))
  // const mess = req.UserBody.mess
  // const from = req.UserBody.from
  // const phone_number_id = req.UserBody.phone_number_id
  // let data = JSON.stringify({
  //   messaging_product: "whatsapp",
  //   recipient_type: "individual",
  //   to: from,
  //   type: "text",
  //   text: { preview_url: false, body: mess },
  // });
  // let config = {
  //   method: "post",
  //   maxBodyLength: Infinity,
  //   url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
  //   headers: {
  //     Authorization: process.env.API_TOKEN,
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };
  // axios(config)
  //   .then((response) => {
  //     res.status(200).send(true);
  //   })
  //   .catch((error) => {
  //     res.status(403).send(false);
  //   });

