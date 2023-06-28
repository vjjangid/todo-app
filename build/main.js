"use strict";

let newTask = document.getElementById("new-task");
newTask.addEventListener("keypress", function(event){
    if(event.key === "Enter")
    {
        if(newTask.value === "")
        {
            alert("Please enter the task name");
            return;
        }
        let newNode = createNewTask(newTask.value);
        let todoListNode = document.getElementById("todo-list");
        todoListNode.append(newNode);
        newTask.value = "";
    }
});

function createNewTask(newTask)
{
    let div = document.createElement("div");
    div.innerHTML = getNewTaskHtml(newTask);
    return div;
}

function getNewTaskHtml(newTask)
{
    return `
    <div class="bg-color todo-item">
    <div class="task">
        <input type="checkbox" id="typing" value="typing" />
        <label for="typing">
            <span class="custom-checkbox"></span>
            ${newTask}
        </label>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
        <path fill="#494C6B" fill-rule="evenodd"
            d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
    </svg>
    </div>
    <hr>`;
}

function getNewTaskHtmlByDOM(newTask)
{
    let parentElement = document.createElement("div");
    parentElement.setAttribute("class", "bg-color todo-item");

    let taskElement = document.createElement("div");
    taskElement.setAttribute("class", "task");

    let inputElement = document.createElement("input");
    inputElement.setAttribute("id", "typing");
    inputElement.setAttribute("value", "typing");
    inputElement.setAttribute("type", "checkbox");

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", "typing");
    labelElement.value = newTask;
    labelElement.appendChild(spanElement);

    let spanElement = document.createElement("span");
    spanElement.setAttribute("class", "custom-checkbox");

    taskElement.appendChild(inputElement);
    taskElement.appendChild(labelElement);

    let svgElement = document.createElement()
    
}
/*
    Action item bar functionality
*/

let actionRow = document.getElementsByClassName("todo-actions");
let pendingTaskEle = actionRow.getElementById("pending-task");

pendingTaskEle.addEventListener(onclick, ()=>{
    let todoListNode = document.getElementById("todo-list");

});

