const express = require("express");
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
// const itemsRoutes = require('./routes/items');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

//db connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true })
    .then(() => console.log(`Database connected successfully!`))
    .catch(err => console.log(err));

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//middle ware
app.use(express.json());
app.use('/api/users', usersRoutes);
// app.use('/api/items', itemsRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});
