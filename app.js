const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4, validate: isUuid } = require('uuid'); 
const connectDB = require('./db');
const User = require('./models/user.model');

const app = express();
// const PORT = 3000;
const PORT = process.env.PORT || 3000;  // Use the PORT from .env or default to 3000

const NODE_ENV = process.env.NODE_ENV || 'development';

connectDB(); // Connect to MongoDB

app.use(bodyParser.json());

// GET all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST a new user
app.post('/api/users', async (req, res, next) => {
  const { username, age, hobbies } = req.body;

  // Check if required fields are provided in the request body
  if (!username || !age) {
      return res.status(400).json({ error: 'Username and age are required fields' });
  }

  try {
      // Check if a user with the same username already exists
      const existingUser = await User.findOne({ username });

      if (existingUser) {
          return res.status(409).json({ error: 'User with this username already exists' });
      }

      // Create a new user
      const newUser = new User({ username, age, hobbies });
      await newUser.save();

      res.status(201).json(newUser);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      next(error);
  }
});


// GET a user by ID
app.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      next(error);

  }
});
app.delete('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!isUuid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
}
  try {
    if(userId){
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      await User.findByIdAndDelete(userId);

      res.status(204).send({"success":true,"message":"user deleted successfully"});
    }
    else{
      res.status(400).send({"success":false,"message":"user not deleted.Smoething went wrong!!"});

    }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      next(error);

  }
});

// Catch-all route for non-existing endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found: The requested resource does not exist' });
});
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
