const express = require('express');
const session = require('express-session');

const connectDB = require('./db');
const { initWebSocket } = require('./controllers/websocketController');
const routes = require('./routes');

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6 * 60 * 60 * 1000 }
}));

app.use('/', routes);

connectDB();

initWebSocket();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
