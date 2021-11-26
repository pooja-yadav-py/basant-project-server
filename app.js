const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();
require('./db/connection');
const cors = require('cors');
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//we link the router files to make our route easy
const routes = require('./router/auth');
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server running on the port ${PORT}`);
})