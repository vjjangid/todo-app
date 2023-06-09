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
        console.log(`${newTask.value}`);
        let newNode = createNewTask(newTask.value);
        console.log(newNode.innerHTML);
        let todoListNode = document.getElementById("todo-list");
        console.log(todoListNode);
        todoListNode.append(newNode);
        console.log(todoListNode);
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