/**
 * Athul Babu Teeyancheri
 * C0944409
 */

//To import required modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//To create Express application
const app = express();
//Define port number
const PORT = 3000;

//Middleware setup
app.use(express.urlencoded({ extended: true })); //To Parse form data
app.use(express.static('public'));

//Set up Pug as template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//To setup MongoDB connection
const MONGODB_URI = 'mongodb+srv://c0944409_db_user:GrB6cCTPEVS0ZeB0@cluster0.1ntl1q8.mongodb.net/userDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connecting...'))
.catch(err => console.error('MongoDB connection error:', err));

//Create user model
const userSchema = new mongoose.Schema({
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    userNotes: { type: String }
});

//To create user model
const User = mongoose.model('User', userSchema);

//Routes
//Home route - redirect to users list
app.get('/', (req, res) => {
    res.redirect('/users');
});

//To display all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('display', { users: users });
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
});

//Show add user form
app.get('/add-user', (req, res) => {
    res.render('add');
});

//Handle add user form submission
app.post('/add-user', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error adding user');
    }
});

//Show update user form
app.get('/update-user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('update', { user: user });
    } catch (err) {
        res.status(500).send('Error finding user');
    }
});

//To update user form submission
app.post('/update-user/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error updating user');
    }
});

//To delete user
app.post('/delete-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error deleting user');
    }
});

//To start server
app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
});