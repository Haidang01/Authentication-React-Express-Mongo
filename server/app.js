const express = require('express');
const router = require('./routes/router');
require('./db/conn');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();


app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}));
app.use(express.json());

app.use(router)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})