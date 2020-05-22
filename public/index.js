// const socket = io('http://localhost:3000')
// const messageContainer = document.getElementById('message-container');
// const messageForm = document.getElementById('send-container');
// const messageInput = document.getElementById('message-input');

window.onload = function() {
    //login submit button
    const loginButton = document.getElementById('register-button');
    loginButton.addEventListener("click", send_user_login_info);
}

function send_user_login_info() {
    // console.log(document.getElementById("username").value);
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var user = {email: email, username: username, password: password};
    var request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };
    fetch('/userInfo/register', request);
}
