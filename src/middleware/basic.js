'use strict';

// const base64 = require('base64-js');
const base64 = require('base-64');
const { users } = require('../models/index');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return authError();
  }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(user, pass);
    next();
  } catch (e) {
    authError();
  }

  function authError() {
    res.status(403).send('Invalid Login in Basic');
  }
};
