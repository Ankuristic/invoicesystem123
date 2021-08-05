require('dotenv').config();
const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const { startingApp } = require('./controllers/user');
const invoiceRouter = require('./routers/invoice');
const app = express();
// const logger = require('./logger');
// logger.info('text info');
// logger.warn('text warn');
// logger.error('text error');

const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const homeRoutes = require('./routers/home-routes');

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use(homeRoutes.routes);

app.use(express.json());
app.use(userRouter);
app.use(invoiceRouter);

startingApp();

app.listen(process.env.PORT, () => {
  console.log('server started at', process.env.PORT);
});
