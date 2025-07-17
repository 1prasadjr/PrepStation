const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(compression());
app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://prepstation-eight.vercel.app"
      ]
    })
  );
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/images', require('./routes/images'));

// Static uploads
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('PrepStation backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 