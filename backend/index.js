require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000   ;

const corsOptions = {
    origin: [ 'http://localhost:3000', 'https://thirtylpa.com'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

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
    const token = req.cookies.access_token;
    console.log("From middleware jwt", token);
    if(token)
    {
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

app.get('/', (req, res) => {
    res.json({message: "Hello world"});
})

app.get('/todos', authenticateJwt, async (req, res)=>{
    const userId = req.user.emailId;
    const user = await User.findOne({ emailId: userId });
    if(user){
        const todosDetails = await Todos.find({ _id: { $in: user.todos } }).lean();
        res.json({message: "Successfull", todos: todosDetails});
    }
    else{
        res.sendStatus(404);
    }
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
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({ message: "Account created successfully" });
    }
});

app.post("/login", async (req, res)=>{
    const { emailId, password } = req.body;
    const user = await User.findOne({emailId});
    console.log("From login" ,user.emailId, user.password);
    if(user){
        if(user.password === password){
            const token = generateJwt(req.body);
            res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                domain: 'thirtylpa'
            })
            .status(200)
            .json({ message: "Logged in successfully"});
        }
        else {
            res.status(403).json({ message: "Wrong password" });
        }
    }
    else{
        res.status(403).json({message: "User is not registered"});
    }
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

app.post('/logout', authenticateJwt,(req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        domain: "localhost"
    });
    res.sendStatus(200);
});

app.put("/todos/:id/status", authenticateJwt, async (req, res) => {
    let userId = req.user.emailId;
    const user = await User.findOne({ emailId: userId });
    if(user)
    {
        const todosDetails = await Todos.find({ _id: { $in: user.todos } }).lean();
        const temp = todosDetails.filter ( (todo) => todo.id === parseInt(req.params.id));
        const respectiveObjectId = temp[0]._id;
        const respectiveTodo = await Todos.findById(respectiveObjectId);
        if(respectiveTodo.completed){
            respectiveTodo.completed = false;
        }
        else{
            respectiveTodo.completed = true;
        }
        
        await respectiveTodo.save();
        res.sendStatus(200);
    }
    else{
        res.sendStatus(404);
    }
});


app.listen(port, () => {
    console.log("backend started");
});