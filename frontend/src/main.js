"use strict";

import * as env from "./env.js";

let ids = new Array();
let allToDos = new Array();
let loggedInUserName = "";

let newTaskElement = document.getElementById("new-task");
newTaskElement.addEventListener("keypress", (event)=>
{
    let newTask = document.getElementById("new-task");
    if(event.key === "Enter")
    {
        
        if(newTask.value === "")
        {
            alert("Please enter the task name");
            return;
        }

        let newTodoNode = addTodoItemInDom(newTask.value, -1);
        addTodosToList(newTodoNode, newTask.value);
        newTask.value = "";
    }
});


function addTodoItemInDom(newTask, uniqueId) {
    let todoListNode = document.getElementById("todo-list");
    let newTodoNode;
    if(uniqueId === -1){
        newTodoNode = createNewTaskWithDefaultUid(newTask);
    }
    else{
        newTodoNode = createNewTaskWithUid(newTask, uniqueId);
    }

    if(loggedInUserName !==  ""){
        console.log(newTodoNode.innerHTML);
        let isUpdated = updateDatabase(newTodoNode, newTask);
        if(!isUpdated){
            alert("Server error Please enter task again");
        }
        todoListNode.append(newTodoNode);
        let hrElement = document.createElement("hr");
        todoListNode.append(hrElement);
        return newTodoNode;
    }
    else{
        alert("Please login first");
    }
}

async function updateDatabase(newTodoNode, newTask)
{
    console.log(newTodoNode.innerHTML);
    let id = newTodoNode.getAttribute("id");

    const response = await fetch(env.prod.todos, {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, name: newTask, completed: false }),
    })

    if(response.ok)
    {
        const data = await response.json();
        console.log(data.message);
        return true;
    }
}

function removeTask(id){
    if(loggedInUserName !== "")
    {
        if(!removeTodoFromDatabase(id)){
            alert("Server error Please try again !!")
            return;
        }
        removeTaskFromDom(id);
        removeTodoFromList(id);
    }
}

async function removeTodoFromDatabase(id){
    console.log("in remove task");
    const response = await fetch(env.prod.todos + `/${id}`, {
        method: "DELETE",
        credentials:"include",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if(response.ok)
    {
        console.log("todo deleted");
        return true;
    }
}

function addTodosToList(newTodoNode, todoName)
{
    let todo = {
        id: parseInt(newTodoNode.getAttribute("id")),
        name: todoName,
        completed: false
    };
    allToDos.push(todo);
}

function removeTodoFromList(id)
{
    for(let i = 0; i<allToDos.length; i++)
    {
        if(allToDos[i].id === parseInt(id))
        {
            allToDos.splice(i, 1);
            break;
        }
    }

    for(let i = 0; i<ids.length; i++)
    {
        if(ids[i] === parseInt(id))
        {
            ids.splice(i, 1);
            return;
        }
    }
}

const activeTaskButton = document.getElementById("show-active-task");
activeTaskButton.addEventListener("click", ()=>{
    let todoListNode = document.getElementById("todo-list");
    let activeTask = new Array();
    for(let i =0; i<allToDos.length; i++)
    {
        if(!allToDos[i].completed)
        {
            let taskElement = createNewTaskWithUid(allToDos[i].name, allToDos[i].id);
            activeTask.push(taskElement);
        }
    }
    todoListNode.innerHTML = "";
    for(let i = 0; i<activeTask.length; i++)
    {
        todoListNode.append(activeTask[i]);
        let hrElement = document.createElement("hr");
        todoListNode.append(hrElement);
    }
});

const completedTaskButton = document.getElementById("show-completed-task");
completedTaskButton.addEventListener("click", ()=>{
    let todoListNode = document.getElementById("todo-list");
    let activeTask = new Array();
    for(let i =0; i<allToDos.length; i++)
    {
        if(allToDos[i].completed)
        {
            let taskElement = createNewTaskWithUid(allToDos[i].name, allToDos[i].id);
            let checkbox = taskElement.children[0].children[0];
            checkbox.checked = true;
            activeTask.push(taskElement);
        }
    }
    todoListNode.innerHTML = "";
    for(let i = 0; i<activeTask.length; i++)
    {
        todoListNode.append(activeTask[i]);
        let hrElement = document.createElement("hr");
        todoListNode.append(hrElement);
    }
});

const allTaskElementButton = document.getElementById("show-all-task");
allTaskElementButton.addEventListener("click", ()=>
{
    let todoListNode = document.getElementById("todo-list");
    let activeTask = new Array();
    for(let i =0; i<allToDos.length; i++)
    {
        let taskElement = createNewTaskWithUid(allToDos[i].name, allToDos[i].id);
        activeTask.push(taskElement);
        if(allToDos[i].completed)
        {
            let checkbox = taskElement.children[0].children[0];
            checkbox.checked = true;
        }
    }
    todoListNode.innerHTML = "";
    for(let i = 0; i<activeTask.length; i++)
    {
        todoListNode.append(activeTask[i]);
        let hrElement = document.createElement("hr");
        todoListNode.append(hrElement);
    }
});

const clearCompletedTaskButton = document.getElementById("clear-completed-task");
clearCompletedTaskButton.addEventListener("click", ()=>{
    let completedTasks = new Array();

    allToDos.forEach(task => {
        if(task.completed)
        {
            completedTasks.push(task.id);
        }
    });

    completedTasks.forEach(element => {
        removeTask(element);
    });
});

function createNewTaskWithDefaultUid(newTask){
    let uniqueId = getUniqueId();
    return createNewTaskElement(newTask, uniqueId);
}

function createNewTaskWithUid(newTask, uniqueId)
{
    return createNewTaskElement(newTask, uniqueId);;
}

function createNewTaskElement(newTask, uniqueId) {
    
    let parentElement  = getParentElement(uniqueId);
    let taskElement = getTaskElement();

    let checkboxElement = getCheckboxElement(uniqueId);
    let checkboxLabelElement = getCheckboxLabelElement();

    let spanNameElement = getSpanElement(checkboxLabelElement, newTask);
    checkboxLabelElement.appendChild(spanNameElement);

    taskElement.appendChild(checkboxElement);
    taskElement.appendChild(checkboxLabelElement);

    const { svgElement, pathElement } = getSvgElement(uniqueId);

    svgElement.appendChild(pathElement);

    parentElement.appendChild(taskElement);
    parentElement.appendChild(svgElement);

    return parentElement;
}

function getTaskElement() {
    let taskElement = document.createElement("div");
    taskElement.setAttribute("class", "task");
    return taskElement;
}

function getParentElement(uniqueId) {
    let parentElement = document.createElement("div");
    parentElement.setAttribute("class", "bg-color todo-item");
    parentElement.setAttribute("id", uniqueId);
    return parentElement;
}

function getSvgElement(uniqueId) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "18");
    svgElement.setAttribute("height", "18");

    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("fill", "#494C6B");
    pathElement.setAttribute("fill-rule", "evenodd");
    pathElement.setAttribute("d", "M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z");

    svgElement.addEventListener("click", () => {
        removeTask(uniqueId);
    });
    return { svgElement, pathElement };
}

function getSpanElement(checkboxLabelElement, newTask) {
    let spanElement = document.createElement("span");
    spanElement.setAttribute("class", "custom-checkbox");
    checkboxLabelElement.appendChild(spanElement);
    let spanNameElement = document.createElement("span");
    spanNameElement.innerText = newTask;
    return spanNameElement;
}

function getCheckboxLabelElement() {
    let checkboxLabelElement = document.createElement("label");
    checkboxLabelElement.setAttribute("for", "typing");
    return checkboxLabelElement;
}

function getCheckboxElement(uniqueId) {
    let checkboxElement = document.createElement("input");
    let uniqueCheckBoxId = getRandomNumber(200) + 100;
    checkboxElement.setAttribute("id", uniqueCheckBoxId);
    checkboxElement.setAttribute("value", "typing");
    checkboxElement.setAttribute("type", "checkbox");
    
    updateAllTodosOnClick(checkboxElement, uniqueId, uniqueCheckBoxId);
    return checkboxElement;
}

function updateAllTodosOnClick(checkboxElement, uniqueTaskId, uniqueCheckBoxId) {
    checkboxElement.addEventListener("click", () => {  
        if(!updateStatusInDatabase(parseInt(uniqueTaskId))){
            alert("Internal server error!! Please try again");
        }
        else{
            for (let i = 0; i < allToDos.length; i++) {
                if (allToDos[i].id === parseInt(uniqueTaskId)) {
                    let checkboxSate = document.getElementById(uniqueCheckBoxId).checked;
                    if (checkboxSate) {
                        allToDos[i].completed = true;
                    }
    
                    else {
                        allToDos[i].completed = false;
                    }
                }
            }
        }
    });
}

async function updateStatusInDatabase(uniqueId)
{
    const response = await fetch(env.prod.todos + `/${uniqueId}/status`, {
        method: "PUT",
        credentials: "include"
    })
    if(response.status === 200)
    {
        console.log("todo updated");
        return true;
    }
    return false;
}

function getUniqueId(){
    let id = getRandomNumber(100);
    
    while(ids.includes(id)){
        id = getRandomNumber();
    }

    ids.push(id);
    return id;
}

function getRandomNumber(range){
    return Math.ceil(Math.random() * range);
}

document.addEventListener("onLogin", (event) => {
    const userName = event.detail.userName;
    loggedInUserName = userName;
    const userTodos = event.detail.todos;
    let todoListNode = document.getElementById("todo-list");
    userTodos.forEach((todo) => {
        let newTodoNode = createNewTaskWithUid(todo.name, todo.id);
        newTodoNode.children[0].children[0].checked = todo.completed;
        todoListNode.append(newTodoNode);
        let hrElement = document.createElement("hr");
        todoListNode.append(hrElement);
        allToDos.push(todo);
        ids.push(todo.id);
    });
    let usernameElement = document.getElementById("username");
    usernameElement.innerText = userName;
    usernameElement.style.display = "block";
    console.log("logged in event raised");
});

document.addEventListener("onLogout", ()=>{
    console.log("user logged out");
    const todoList = document.getElementById("todo-list");
    while(todoList.firstChild){
        todoList.removeChild(todoList.firstChild);
    }
    const userNameElement = document.getElementById("username");
    userNameElement.style.display = "none";
    ids = new Array();
    allToDos = new Array();
});

function removeTaskFromDom(id)
{
    let taskElement = document.getElementById(id);
    let hrElement = taskElement.nextElementSibling;
    taskElement.remove();
    if(hrElement !== null){
        hrElement.remove();
    }
}