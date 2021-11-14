// importing express, bodyparser and mongoose to create end point, parse json and connect with mongodb

const express = require('express')
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');

// importing user model to create instance of user
const User = require('./userModel');

// importing comment model to create instance of comment
const Comment = require('./commentModel');

// configuring CORS for origin requesting
app.use((req,res,next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers','Content-Type');
  next();
})

// importing bycrpt to decrpt password
const bcrypt = require('bcryptjs');

const port = 3000

// using bodyparser to support json parsing
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// connecting the db using mongoose
mongoose.connect("mongodb://localhost:27017/Club-Management", { useNewUrlParser: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.log('Error in the database:', err);
});

// declaring /login and /signup endpoints to accept user data fro  frontend
app.post('/login', async(req, res) => {
  const { username, password } = req.body;

   //simple validation
   if (!username || !password) {
       return res.status(200).json({ msg: 'Please enter all fields' });
   }

   // checking if the user exists -> returns the user info else -> returns the non-existence of a user 

   const user = await User.findOne({ username });
   if (user) {
     
     // check user password with hashed password stored in the database
     const validPassword = await bcrypt.compare(password, user.password);
     if (validPassword) {
       res.status(200).json({ 
        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email
                           }
        });
     } else {
       res.status(400).json({ error: "Invalid Password" });
     }
   } else {
     res.status(401).json({ error: "User does not exist" });
   }

})

app.post('/signup', (req, res) => {
   const { username, email, password } = req.body;
   console.log(req.body)
   //simple validation
   if (!username || !email || !password) {
       return res.status(400).json({ msg: 'Please enter all fields' });
   }

   // checking if the user exists -> returns the existence of a user else -> creates new user with the provided info 
   User.findOne({ email })
   .then(user => {
       if (user) {
           return res.status(400).json({ msg: 'User already exists!!' });
       } else {
           const newAcccount = new User({
               username,
               email,
               password
           })

           //create salt and hash to decrypt password
           bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newAcccount.password, salt, (err, hash) => {
                   if (err) throw err;
                   newAcccount.password = hash;
                   newAcccount.save().
                       then(user => {
                               if (err) throw err;
                               res.json({
                                   user: {
                                       id: user.id,
                                       username: user.username,
                                       email: user.email
                                   }
                               })
                       })
               })
           })
       }
   })
})

app.post("/submit", (req,res)=>{
    const { email, subject, message } = req.body;
    console.log(req.body)
    //simple validation
    if (!email || !subject || !message) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    var comment = new Comment({
        email,
        subject,
        message
    })
    comment.save().then(comment => {
        res.json({
            msg: "sucessfully"
        })
    })
})

app.use(express.json())
app.listen(port)