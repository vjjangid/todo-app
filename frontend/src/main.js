"use strict";

let ids = new Array();
let allToDos = new Array();

function fetchTodos()
{
    fetch("http://localhost:3000/todos")
    .then( (response) => {
        return response.json();
    })
    .then((data)=>{
        loadAllTodos(data);
    })
    .catch(error => {
        console.log(error);
    })
}

fetchTodos();

function loadAllTodos(todos)
{
    todos.forEach(todo => {
        allToDos.push(todo);
        addTodoItem(todo.name, todo.id);
    })
}

function onEnterTask(event)
{
    let newTask = document.getElementById("new-task");
    if(event.key === "Enter")
    {
        
        if(newTask.value === "")
        {
            alert("Please enter the task name");
            return;
        }

        let newTodoNode = addTodoItem(newTask.value, -1);
        addTodosToList(newTodoNode, newTask.value);
        newTask.value = "";
    }
}

function addTodoItem(newTask, uniqueId) {
    let todoListNode = document.getElementById("todo-list");
    let newTodoNode;
    if(uniqueId === -1)
    {
        newTodoNode = createNewTaskWithDefaultUid(newTask);
    }
    else
    {
        newTodoNode = createNewTaskWithUid(newTask, uniqueId);
    }
    todoListNode.append(newTodoNode);
    let hrElement = document.createElement("hr");
    todoListNode.append(hrElement);
    return newTodoNode;
}

function removeTask(id){
    let taskElement = document.getElementById(id);
    let hrElement = taskElement.nextElementSibling;
    taskElement.remove();
    hrElement.remove();
    removeTodoFromList(id);
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
            return;
        }
    }
}

function showActiveTask()
{
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
}

function showCompletedTask()
{
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
}

function showAllTask()
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
}

function clearCompletedTasks()
{
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
}

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
    });
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
