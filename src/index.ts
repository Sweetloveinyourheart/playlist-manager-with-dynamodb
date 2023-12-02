import express from 'express';
import * as bodyParser from 'body-parser'
import { initDynamodbConnection } from './database/connection';
import routes from './routes';
import { GlobalException } from './exceptions/global.exception';

const app = express();

// init dynamodb connection
initDynamodbConnection()

// middlewares
app.use(bodyParser.json())

// routes
app.use('/api/v1', routes)

// exception handling
app.use(GlobalException)

// listen
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log("🚀 Server launch on port", port)
})