const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.registerUser = async (req, res) => {
  const { name, college, stream, branch, year, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, college, stream, branch, year, email, password });
    await user.save();
    const token = generateToken(user);
    
    // Return user data (excluding password) along with token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      stream: user.stream,
      branch: user.branch,
      year: user.year,
      isAdmin: user.isAdmin // <-- this must be present
    };
    
    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    
    // Return user data (excluding password) along with token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      college: user.college,
      stream: user.stream,
      branch: user.branch,
      year: user.year,
      isAdmin: user.isAdmin // <-- this must be present
    };
    
    res.json({ token, user: userResponse });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
}; 