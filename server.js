const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to db
connectDB();

//Route files
const auth = require('./routes/auth');
const users = require('./routes/users');

//Initialize express application
const app = express();

//Bodyparser
app.use(express.json());

app.use(cookieParser());

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

//Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
