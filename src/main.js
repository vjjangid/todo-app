"use strict";

let ids = new Array();

let newTask = document.getElementById("new-task");
newTask.addEventListener("keypress", function(event){
    if(event.key === "Enter")
    {
        if(newTask.value === "")
        {
            alert("Please enter the task name");
            return;
        }

        let todoListNode = document.getElementById("todo-list");
        let newNode = createNewTask(newTask.value);
        todoListNode.append(newNode);
        newTask.value = "";
    }
});

function removeTask(id){
    let taskElement = document.getElementById(id);
    taskElement.remove();
}

function getUniqueId(){
    let id = getRandomNumber();
    
    while(ids.includes(id)){
        id = getRandomNumber();
    }

    ids.push(id);
    return id;
}

function getRandomNumber(){
    return Math.ceil(Math.random() * 100);
}

let actionRow = document.getElementsByClassName("todo-actions");
let pendingTaskEle = document.getElementById("pending-task");

pendingTaskEle.addEventListener(onclick, ()=>{
    let todoListNode = document.getElementById("todo-list");

});

function createNewTask(newTask){
    let parentElement = document.createElement("div");
    parentElement.setAttribute("class", "bg-color todo-item");
    const uniqueId = getUniqueId();
    parentElement.setAttribute("id", uniqueId);
    let taskElement = document.createElement("div");
    taskElement.setAttribute("class", "task");

    let inputElement = document.createElement("input");
    inputElement.setAttribute("id", "typing");
    inputElement.setAttribute("value", "typing");
    inputElement.setAttribute("type", "checkbox");

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", "typing");

    let spanElement = document.createElement("span");
    spanElement.setAttribute("class", "custom-checkbox");
    labelElement.appendChild(spanElement);
    let spanNameElement = document.createElement("span");
    spanNameElement.innerText = newTask;
    labelElement.appendChild(spanNameElement);
    
    taskElement.appendChild(inputElement);
    taskElement.appendChild(labelElement);

    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "18");
    svgElement.setAttribute("height", "18");

    // Create the path element
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("fill", "#494C6B");
    pathElement.setAttribute("fill-rule", "evenodd");
    pathElement.setAttribute("d", "M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z");

    svgElement.addEventListener("click", ()=>
    {
        removeTask(uniqueId);
    });

    // Append the path element to the SVG element
    svgElement.appendChild(pathElement);

    parentElement.appendChild(taskElement);
    parentElement.appendChild(svgElement);

    let hrElement = document.createElement("hr");
    parentElement.after(hrElement);

    return parentElement;
}

