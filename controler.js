const getReplay = (bodyMess) => {
  const mess = bodyMess.entry[0].changes[0].value.messages[0].text.body;
};

module.exports = { getReplay };
