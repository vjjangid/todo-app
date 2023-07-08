"use strict";
import * as env from "./env.js";

let loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", ()=>{
    let popUpmodel = document.getElementById("modal-container");
    popUpmodel.style.display = "block";

});

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
    console.log(emailInput);
    console.log(passwordInput);
    let modalHeaderElement = document.getElementById("modal-header");
    if (modalHeaderElement.innerHTML === "Signup")
    {
        const obj = JSON.stringify({emailId: emailInput, password: passwordInput});
        console.log(obj);
        const response = await fetch(env.prod.signup,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify({emailId: email, password: password}),
            });
        if(response.ok){
            await response.json();
            emailInput.value = '';
            passwordInput.value = '';
        }
        else{
            const error = await response.json();
            console.log(error.message);
        }
    } 

});

