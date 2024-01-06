const express = require('express')
const body_parser = require('body-parser')
const axios = require('axios')

const app = express().use(body_parser.json())
const port = process.env.PORT || 8000
const my_token = process.env.MYTOKEN
const API_token = process.env.API_TOKEN

const BulkSMS =
  'We are no.1 Bulk SMS service provider in India. Please select the service you want to apply for.Bulk  \n\n1. Promotional SMS \n2. Transactional SMS \n3. Sender ID'
const PromotionalSMS_1 =
  'You have selected option\n1. Promotional SMS\n\nPlease select the Quantity option.\n\nReply with option name or number (2.1 or 2.3 or 1 lack)\n\n1.1. Less then 1 lack \n1.2. 1-5 lacks \n1.3. 5-10 lacks \n1.4. More then 10 lacks'
const TransactionalSMS_2 =
  'You have selected option\n2. Transactional SMS\n\nPlease select the Quantity option.\n\nReply with option name or number (2.1 or 2.3 or 1 lack)\n\n2.1. Less then 1 lack\n2.2. 1-5 lacks\n2.3. 5-10 lacks\n2.4. More then 10 lacks'
const Last_mess = `Thanks you for your reply.😊\n\nOur support executive will get back to you very soon.`

app.get('/', (req, res) => {
  res.send('Webhook')
})
app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode']
  let challenge = req.query['hub.challenge']
  let token = req.query['hub.verify_token']

  if (mode && token) {
    if (mode === 'subscribe' && token === my_token) {
      res.status(200).send(challenge)
    } else {
      res.status(403)
    }
  } else {
    res.status(403)
  }
})

app.post('/webhook', (req, res) => {
  let bodyMess = req.body
  console.log(bodyMess, null, 2)
  if (bodyMess.object) {
    console.log('bodyMess if in :-', bodyMess)
    if (
      bodyMess.entry &&
      bodyMess.entry[0].changes &&
      bodyMess.entry[0].changes[0].value.messages &&
      bodyMess.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        bodyMess.entry[0].changes[0].value.metadata.phone_number_id
      let from = bodyMess.entry[0].changes[0].value.messages[0].from
      let mess = bodyMess.entry[0].changes[0].value.messages[0].text.body

      console.log('phone_number_id', phone_number_id)
      console.log('from', from)
      console.log('mess', mess)

      let Replay

      switch (mess) {
        case 'Promotional SMS':
          Replay = PromotionalSMS_1
          break
        case '1. Promotional SMS':
          Replay = PromotionalSMS_1
          break
        case '1':
          Replay = PromotionalSMS_1
          break
        case 'Transactional SMS':
          Replay = TransactionalSMS_2
          break
        case '2. Transactional SMS':
          Replay = TransactionalSMS_2
          break
        case '2':
          Replay = TransactionalSMS_2
          break
        case 'Sender ID':
          Replay = Last_mess
          break
        case '3. Sender ID':
          Replay = Last_mess
          break
        case '3':
          Replay = Last_mess
          break
        case '2.1. Less then 1 lack':
          Replay = Last_mess
          break
        case '2.2. 1-5 lacks':
          Replay = Last_mess
          break
        case '2.3. 5-10 lacks':
          Replay = Last_mess
          break
        case '2.4. More then 10 lacks':
          Replay = Last_mess
          break
        case '1.1. Less then 1 lack':
          Replay = Last_mess
          break
        case '1.2. 1-5 lacks':
          Replay = Last_mess
          break
        case '1.3. 5-10 lacks':
          Replay = Last_mess
          break
        case '1.4. More then 10 lacks':
          Replay = Last_mess
          break
        case 'Less then 1 lack':
          Replay = Last_mess
          break
        case '1-5 lacks':
          Replay = Last_mess
          break
        case '5-10 lacks':
          Replay = Last_mess
          break
        case 'More then 10 lacks':
          Replay = Last_mess
          break
        case '2.1':
          Replay = Last_mess
          break
        case '2.2':
          Replay = Last_mess
          break
        case '2.3':
          Replay = Last_mess
          break
        case '2.4':
          Replay = Last_mess
          break
        case '1.1':
          Replay = Last_mess
          break
        case '1.2':
          Replay = Last_mess
          break
        case '1.3':
          Replay = Last_mess
          break
        case '1.4':
          Replay = Last_mess
          break
        case '2.1.':
          Replay = Last_mess
          break
        case '2.2.':
          Replay = Last_mess
          break
        case '2.3.':
          Replay = Last_mess
          break
        case '2.4.':
          Replay = Last_mess
          break
        case '1.1.':
          Replay = Last_mess
          break
        case '1.2.':
          Replay = Last_mess
          break
        case '1.3.':
          Replay = Last_mess
          break
        case '1.4.':
          Replay = Last_mess
          break
        default:
          Replay = BulkSMS
          break
      }
      const Data = JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: from,
        type: 'text',
        text: {
          preview_url: false,
          body: Replay,
        },
      })

      var config = {
        method: 'post',
        url: `https://graph.facebook.com/v15.0/${phone_number_id}/messages`,
        headers: {
          authorization: `Bearer ${API_token}`,
          'Content-Type': 'application/json',
        },
        data: Data,
      }

      axios(config)
        .then(function (response) {
          console.log('response', response.data)
          res.sendStatus(200)
        })
        .catch(function (error) {
          console.log('error', error)
          res.sendStatus(403)
        })
    } else {
      res.sendStatus(403)
    }
  } else {
    res.sendStatus(403)
  }
})

app.listen(port, () => {
  console.log('webhook is listening on srver')
})
