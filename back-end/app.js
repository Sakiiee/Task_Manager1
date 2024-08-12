const express = require('express');
const mongoose = require('mongoose');
const routes = require('./UserRouter/userRouter');
const route = require('./TaskRouter/TRouter')
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Task_Manager')
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((err) => {
        console.log(err);
    });
    
app.use('/', routes , route);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
