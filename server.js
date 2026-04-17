const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Import Models
const Blog = require('./models/Blog');

// Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs' });
  }
});

// Placeholder routes for Admin (We will refine this later)
const authMiddleware = (req, res, next) => { req.admin = { id: 'admin_id' }; next(); };

app.post('/api/blogs', async (req, res) => {
  console.log("Received Data:", req.body); // Debug: Check what is arriving
  
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    // This will print the REAL error in your terminal
    console.log("ERROR:", error); 
    res.status(500).json({ message: 'Error saving blog', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));