const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");

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

const TODOS = mongoose.model("Todos", todoSchema);

mongoose.connect("mongodb+srv://vjjangid:rwxzX3PQlTu1mg71@cluster0.iqqseyl.mongodb.net/todos", { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "todos" 
}).then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });;      

app.get('/todos', (req, res)=>{
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = {
      id: req.body.id, // unique random id
      name: req.body.name,
      completed: req.body.completed
    };
    const newTodoObj = new TODOS(newTodo);
    newTodoObj.save().then((savedTodo)=>{
        console.log("Saved the data");
        res.status(201).json(savedTodo);
    })
    .catch((error)=>{
        res.status(500).json({ error: "Error creating todo" });
    });
    
});

app.listen(port, () => {
    console.log("backend started");
});