// const socket = io('http://localhost:3000')
// const messageContainer = document.getElementById('message-container');
// const messageForm = document.getElementById('send-container');

// let loggedInUser = "";

window.onload = function() {
    //show which user is logged in
    if(document.getElementById("user-logged-in") && sessionStorage.getItem("username") != null) {
        document.getElementById("user-logged-in").textContent =
        "Currently logged in as: " + sessionStorage.getItem("username");
    }

    //register submit button
    if(document.getElementById('register-button')) {
        const registerButton = document.getElementById('register-button');
        registerButton.addEventListener("click", send_register_data);
    }

    //login submit button
    if(document.getElementById('login-button')) {
        const loginButton = document.getElementById('login-button');
        loginButton.addEventListener("click", check_login_data);
    }

    //conversation send button
    if(document.getElementById('send-button')) {
        const sendButton = document.getElementById('send-button');
        sendButton.addEventListener("click", send_message);
    }

    //
    if(document.getElementById("new-conversation-button")) {
        const newConversationButton = document.getElementById("new-conversation-button");
        newConversationButton.addEventListener("click", new_conversation);
    }

}

function send_register_data() {
    var email = document.getElementById("register-email");
    var username = document.getElementById("register-username");
    var password = document.getElementById("register-password");
    var user = {email: email.value, username: username.value, password: password.value};
    email.value = "";
    username.value = "";
    password.value = "";
    var request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };
    fetch('/userInfo/register', request)
        .then ( res => {
            if(res.status == 201) {
                document.location.href = 'http://localhost:3000/login.html';
            } else if(res.status == 400) {
                document.getElementById("user-taken-or-not").textContent =
                "The username already exists, please try a different one";
            }
        });
}

function check_login_data() {
    var username = document.getElementById("login-username");
    var password = document.getElementById("login-password");
    var user = {username: username.value, password: password.value};
    username.value = "";
    password.value = "";
    var request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };
    fetch('/userInfo/login', request)
        .then ( res => {
            if(res.status == 201) {
                sessionStorage.setItem("username", user.username);
                document.location.href = 'http://localhost:3000/index.html';
            } else {
                document.getElementById("wrong-or-right-user").textContent =
                "You have entered the wrong username or paswword, pleas try again";
            }
        });
}

function send_message() {
    var messageInput = document.getElementById('message-input');
    var message = {message: messageInput.value, user: sessionStorage.getItem("username")};
    messageInput.value = "";
    var request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };
    fetch('/message', request);
}

function new_conversation() {
    var promptInput = prompt("Enter the peron you want to chat with");
    var person = {person: promptInput, starterUser: sessionStorage.getItem("username")};
    var request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(person)
    };
    fetch('/userInfo/rooms', request);
}
