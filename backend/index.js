const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
}));

let todos = new Array();
todos.push({
    id: 1,
    name: "new task",
    completed: false
});

app.get('/todos', (req, res)=>{
    res.json(todos);
});

app.post('/todos', (req, res) => {
    const newTodo = {
      id: req.body.id, // unique random id
      name: req.body.title,
      completed: req.body.completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.listen(port, () => {
    console.log("backend started");
});