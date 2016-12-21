'use strict';

const express = require('express');

const app = express();
const stage = process.env.NODE_ENV || 'development';
const config = require('./config/config')[stage];
const passport = require('passport');
const database = require('./config/database')(config);
const data = require('./data')();
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const auth = require('./server/config/auth');
// const upload = multer({ storage: storage });
const encryption = require('./utilities/encryption');
// const userMiddleware = require('./server/middlewares/user-middleware');

require('./config/express')(config, app);
const controllers = require('./controllers')({ app, encryption, data, passport });
require('./routers')({ app, controllers });

app.listen(config.port, () => console.log('Server running at port : ' + config.port));