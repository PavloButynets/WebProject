require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const routes = require('./src/routes/routes')

const PORT = process.env.PORT;

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000", }));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}, Request Body:`, req.body);
    next();
  });
  
app.use("/api", routes);
// Підключення до MongoDB
mongoose.connect(process.env.DB_CONNECTION_STR, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));



app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
