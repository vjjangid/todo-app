require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.port || 3000   ;

app.use(cors());
app.use(bodyParser.json());

let todos = new Array();

const todoSchema = mongoose.Schema({
    id: Number,
    name: String,
    completed: Boolean
});

const userSchema = mongoose.Schema({
    emailId: String,
    password: String,
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todos" }]
});

const Todos = mongoose.model("Todos", todoSchema);
const User = mongoose.model("User", userSchema);

mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "todos" 
}).then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
console.error("Error connecting to MongoDB:", error);
});

const generateJwt = function(user)
{
    const payload = { emailId: user.emailId };
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h"});
}

const authenticateJwt = (req, res, next) => {
    const authenticationHeader = req.headers.authorization
    if(authenticationHeader)
    {
        const token = authenticationHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    }
    else
    {
        res.sendStatus(401);
    }
};

app.get('/todos', authenticateJwt, (req, res)=>{
    res.json({});
});

app.post("/signup", async (req, res) => {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if(user)
    {
        res.status(403).json({ message: "Acount already exists!"});
    }
    else
    {
        const newUser = new User({emailId, password});
        await newUser.save();
        const token = generateJwt(req.body);
        res.json({ message: "Account created successfully", token});
    }
});

app.post("/login", async (req, res)=>{
    const { emailId, password } = req.body;
    const user = await User.findOne({emailId});
    if(user){
        const token = generateJwt(req.body);
        res.json({ message: "Logged in successfully", token});
    }
    
    res.status(403).json({message: "User is not registered"});
});

app.post('/todos',  authenticateJwt, async(req, res) => {
    
    const userId = req.user.emailId;
    const user = await User.findOne({ emailId: userId });
    if (!user) {
      res.sendStatus(404);
    }

    const newTodo = new Todos({
        id: req.body.id,
        name: req.body.name,
        completed: req.body.completed
      });
    await newTodo.save();

    user.todos.push(newTodo._id);
    const saveUser = await user.save();
    
    if(saveUser)
    {
        res.send({message: "Task added successfully"});
    }
    else
    {
        res.sendStatus(404);
    }
});

app.get('/todos/:id', authenticateJwt, async (req, res)=>{
    const userId = req.user.emailId;
    const user = await User.findOne({ emailId: userId });
    if (user) {
      const todosDetails = await Todos.find({ _id: { $in: user.todos } }).lean();
      const temp = todosDetails.filter ( (todo) => todo.id === parseInt(req.params.id));
      if(temp.length !== 0) {
        res.json(temp);
      }
      else {
        res.sendStatus(404); 
      }
    }
    else {
        res.sendStatus(404);
    }

});

app.delete('/todos/:id', authenticateJwt, async (req, res) => {
    const userId = req.user.emailId;
    const user = await User.findOne({ emailId: userId });
    if(user) {
        const todosDetails = await Todos.find({ _id: { $in: user.todos } }).lean();
        const temp = todosDetails.filter ( (todo) => todo.id === parseInt(req.params.id));
        if(temp.length !== 0) {
            user.todos.pull(temp[0]._id);
            await user.save();
            const deletedTodo = await Todos.findByIdAndDelete( temp[0]._id );
            res.json({message: "Successfully deleted", name: deletedTodo.name});
        }
    }
    else {
        res.sendStatus(404);    
    }

});

app.listen(port, () => {
    console.log("backend started");
});