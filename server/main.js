const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const { initWebSocket } = require('./controllers/websocketController');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

connectDB();

app.use('/api/users', userRoutes);
app.use('/api', fileRoutes);
app.use('/', resourceRoutes);

initWebSocket();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
