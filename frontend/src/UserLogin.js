"use strict";
import * as env from "./env.js";

let loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", ()=>{
    let popUpmodel = document.getElementById("modal-container");
    popUpmodel.style.display = "block";

    console.log(loginButton.innerText);
    const loginButtonValue = loginButton.innerText;
    if(loginButtonValue === "Logout")
    {
        if(logout()){
            console.log("logged out");
            loginButton.innerText = "Login";
            closeModal();
            onLogout();
        }
        else{
            alert("server error Please try again");
        }
    }
});

async function logout(){
    const response = await fetch(env.prod.logout, {
        method: "POST",
        credentials: "include",
    });
    if(response.status === 200)
    {
        return true;
    }
}

let modelContainer = document.getElementById("modal-container");
modelContainer.addEventListener("click", (event)=>{
    const modalContainer = document.getElementById("modal-container");

    if (event.target === modalContainer) {
        modalContainer.style.display = "none";
    }
})

let modalContent = document.getElementById("modal-content");
modalContent.addEventListener("click", (event)=> {
    event.stopPropagation();
})

let formAction = document.getElementById("form-action");
formAction.addEventListener("click", ()=>{
    let modalHeaderElement = document.getElementById("modal-header");
    if (modalHeaderElement.innerHTML === "Login") {
        modalHeaderElement.innerHTML = "Signup";
        let modalFooterElement = document.getElementById("modal-footer");
        modalFooterElement.innerHTML = `<p id="modal-footer">Already a member? <a class="form-action" id="form-action">Login</a></p>`;
        const formActionChild = document.getElementById("form-action");
        formActionChild.addEventListener("click", formEventHandeler);
    }
    else {
        modalHeaderElement.innerHTML = "Login";
        let modalFooterElement = document.getElementById("modal-footer");
        modalFooterElement.innerHTML = `<p id="modal-footer">Not a member? <a class="form-action" id="form-action">Sigup</a></p>`;
        const formActionChild = document.getElementById("form-action");
        formActionChild.addEventListener("click", formEventHandeler);
    }
})


function formEventHandeler()
{
    let modalHeaderElement = document.getElementById("modal-header");
    if (modalHeaderElement.innerHTML === "Login") {
        modalHeaderElement.innerHTML = "Signup";
        let modalFooterElement = document.getElementById("modal-footer");
        modalFooterElement.innerHTML = `<p id="modal-footer">Already a member? <a class="form-action" id="form-action">Login</a></p>`;
        const formActionChild = document.getElementById("form-action");
        formActionChild.addEventListener("click", formEventHandeler);
    }
    else {
        modalHeaderElement.innerHTML = "Login";
        let modalFooterElement = document.getElementById("modal-footer");
        modalFooterElement.innerHTML = `<p id="modal-footer">Not a member? <a class="form-action" id="form-action">Sigup</a></p>`;
        const formActionChild = document.getElementById("form-action");
        formActionChild.addEventListener("click", formEventHandeler);
    }
}

let submitButton = document.getElementById("submit");
submitButton.addEventListener("click", async () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value;
    const password = passwordInput.value;
    let modalHeaderElement = document.getElementById("modal-header");
    if (modalHeaderElement.innerHTML === "Signup"){
        console.log("In signup");
        await onSigningUpUser(emailInput, passwordInput, email, password);
        closeModal();
    }
    else if(modalHeaderElement.innerHTML === "Login"){
        await onLoginOfUser(emailInput, passwordInput, email, password);
        closeModal();
    }

});

async function onSigningUpUser(emailInput, passwordInput, email, password) {
    const response = await fetch(env.prod.signup,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailId: email, password: password }),
        });
    if (response.status === 200) {
        await response.json();
        emailInput.value = '';
        passwordInput.value = '';
    }
    else {
        alert("Invalid input please try again");
    }
}

async function onLoginOfUser(emailInput, passwordInput, email, password) {
    const response = await fetch(env.prod.login,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ emailId: email, password: password }),
        });
    if (response.status === 200) {
        await response.json();
        emailInput.value = '';
        passwordInput.value = '';
        const getAllTodoResponse = await fetch(env.prod.todos,
            {
                method: "GET",
                credentials: "include",
            });
        if(getAllTodoResponse.status === 200){
            const data = await getAllTodoResponse.json();
            const userInfo = {
                userName: email,
                todos: data.todos
            }
            const loginButtonElement = document.getElementById("login-button");
            loginButtonElement.innerText = "Logout";
            onLogin(userInfo);
            return;
        }
        else{
            alert("Opps!! something wrong plese try again");
        }
    }
    else {
        alert("invalid user please try again");
    }
}

function closeModal()
{
    const modalContainer = document.getElementById("modal-container");
    modalContainer.style.display = "none";  
}

function onLogin(userInfo)
{
    const loginEvent = new CustomEvent("onLogin", {
        detail: {
            userName: userInfo.userName,
            todos: userInfo.todos
        },
        bubbles: true,
        cancelable: false       
    });

    document.dispatchEvent(loginEvent);
}

function onLogout()
{
    const logoutEvent = new CustomEvent("onLogout", {
        bubbles:true,
        cancelable:false
    })
    document.dispatchEvent(logoutEvent);
    console.log("Logout event dispached");
}
