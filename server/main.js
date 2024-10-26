const express = require('express');
const connectDB = require('./db');
const { initWebSocket } = require('./controllers/websocketController');
const routes = require('./routes');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', routes);

connectDB();

initWebSocket();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
