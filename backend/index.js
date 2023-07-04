const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const port = process.env.port || 90001;

app.use(cors());
app.use(bodyParser.json());

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
      name: req.body.name,
      completed: req.body.completed
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.listen(port, () => {
    console.log("backend started");
});