const GetUserMess = (req, res , next) => {
  let bodyMess = req.body;
//   const data = JSON.stringify(bodyMess, null, 2);
//   console.log("req :-", data);
  if (bodyMess.object) {
    if (
      bodyMess.entry &&
      bodyMess.entry[0].changes &&
      bodyMess.entry[0].changes[0].value.messages &&
      bodyMess.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        bodyMess.entry[0].changes[0].value.metadata.phone_number_id;
      let from = bodyMess.entry[0].changes[0].value.messages[0].from;
      let mess = bodyMess.entry[0].changes[0].value.messages[0].text.body;

      req.UserBody = {
        phone_number_id,
        from,
        mess
      }
      next();
    }else{
        res.status(403).send('User Resource not found')
    }
  } else{
    res.status(403).send('Resource not found')
  }
};

module.exports = GetUserMess;
