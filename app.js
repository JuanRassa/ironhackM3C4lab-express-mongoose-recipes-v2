const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe.model');

const app = express();

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.static('public'));
app.use(express.json());

// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = 'mongodb://127.0.0.1:27017/express-mongoose-recipes-dev';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to Mongo! Database name: "${connection.connections[0].name}"`);
  } catch (error) {
    console.log('Error connecting to mongoDB', error);
  }
};
connectDB();
// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
  res.send('<h1>LAB | Express Mongoose Recipes</h1>');
});

//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async (req, res) => {
  const { title, instructions, level, ingredients, duration, isArchived } = req.body;

  try {
    const createdRecipe = await Recipe.create({
      title: title,
      instructions: instructions,
      level: level,
      ingredients: ingredients,
      duration: duration,
      isArchived: isArchived,
    });
    res.status(201).send(createdRecipe);
  } catch (error) {
    res.status(500).json({ message: 'An error occured creating a recipe.' });
  }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).send(recipes);
  } catch (error) {
    res.status(500).json({ message: 'An error occured while retrieving all recipes.' });
  }
});

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'An error occured while retrieving a recipe by id.', error: error });
  }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:id', async (req, res) => {
  try {
    const editedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(editedRecipe);
  } catch (error) {
    res.status(500).message({ message: 'An error occured while editing a recipe.' });
  }
});
//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.del('/recipes/:id', async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id, req.body, { new: true });
    console.log(deletedRecipe);
    res.status(204).send();
  } catch (error) {
    res.status(500).message({ message: 'An error occured while deleting a recipe.' });
  }
});

// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));

//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
