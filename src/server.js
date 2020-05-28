const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;
const server = require('http').Server(express);
const io = require('socket.io')(server);
const bcrypt = require('bcrypt');

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;
const mongoName = process.env.MONGO_NAME;

var mongoUrl = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0-ne0jv.mongodb.net/${mongoName}?retryWrites=true&w=majority`;

console.log(mongoUrl);

var database = null;
var users = null;

const app = express();
var port = process.env.PORT || 3000 || 3333;

app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const userInfo = [];
var roomID = 0;

app.engine("hbs", exphbs());
app.set("view engine","hbs");

app.get('/userInfo/register', (req, res) => {
    res.json(userInfo);
});

app.post('/userInfo/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        if(userInfo.length != 0) {
            for(var i = 0; i < userInfo.length; i++) {
                if(req.body.username === userInfo[i].username) {
                    return res.status(400).send('User already exists, please try another username');
                }
            }
        }
        const user = {email: req.body.email, username: req.body.username, password: hashedPassword, messages: [], rooms: []};
        userInfo.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/userInfo/login', async (req, res) => {
    const user = userInfo.find(user => user.username === req.body.username);
    if(user == null) {
        return res.status(400).send('Connot find user')
    } try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(201)
            res.send('Success');
            console.log("Success");
        }
        else {
            res.status(400);
            res.send('Not Allowed');
            console.log("Not Allowed");
        }
    } catch {
        res.status(500).send();
    }
});

app.post('/message', (req, res) => {
    for(var i = 0; i < userInfo.length; i++) {
        if(userInfo[i].username === req.body.user)
            userInfo[i].messages.push(req.body.message);
    }
});

app.post('/userInfo/rooms', (req, res) => {
    var newConvoUserIndex = 0, oldConvoUserIndex = 0, match = false, userExists = true;
    for(var i = 0; i < userInfo.length; i++) {
        if(userInfo[i].username === req.body.person)
            newConvoUserIndex = i;
        if(userInfo[i].username === req.body.starterUser)
            oldConvoUserIndex = i;
        if(userInfo[i].username !== req.body.person)
            userExists = false;
    }
    for(var i = 0; i < userInfo[newConvoUserIndex].rooms.length; i++) {
        for(var j = 0; j < userInfo[oldConvoUserIndex].rooms.length; j++) {
            if(userInfo[newConvoUserIndex].rooms[i] == userInfo[oldConvoUserIndex].rooms[j]) {
                console.log("Conversation already exists with person");
                match = true;
                return;
            }
        }
    }
    if(match === false && userExists === true) {
        userInfo[newConvoUserIndex].rooms.push(roomID);
        userInfo[oldConvoUserIndex].rooms.push(roomID);
        roomID++;
    } else {
        console.log("User does not exist");
    }
});

io.on("connection", () => {
    console.log("a user is connected");
})

// app.get('/index.html', function (req, res) {
//     console.log("Sending home page");
//     res.status(200).render('index');
// });
//
// app.get('/login', function(req, res) {
//     console.log("Sending login page");
//     res.status(200).render('login');
// });
//
// app.get('/conversations', function(req, res) {
//     console.log("Sending conversation page");
//     res.status(200).render('conversations');
// });

//404 handler
app.get('*', function (req, res) {
    console.log("Sending 404");
    // res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    res.status(404).render("404");
});


MongoClient.connect(mongoUrl, {useNewUrlParser: true}, function (err,client){
  if(err)
    throw err;
  database = client.db(mongoName);
  users = database.collection('users');
  app.listen(port, () => console.log('Listening on port ', port));
});

// app.listen(port, () => console.log('Listening on port', port));
