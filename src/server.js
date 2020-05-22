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

app.engine("hbs", exphbs());
app.set("view engine","hbs");

app.get('/userInfo/register', (req, res) => {
    res.json(userInfo);
})

app.post('/userInfo/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = {email: req.body.email, username: req.body.username, password: hashedPassword};
        userInfo.push(user);
        console.log(userInfo);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

app.post('/userInfo/login', async (req, res) => {
    userInfo.push(req.body);
    console.log(userInfo);
    // const user = users.find(user => user.name === req.body.name);
    // if(user == null) {
    //     return res.status(400).send('Connot find user')
    // } try {
    //     if (await bcrypt.compare(req.body.password, user.password)) res.send('Success');
    //     else res.send('Not Allowed');
    // } catch {
    //     res.status(500).send();
    // }
})

// app.get('/', function (req, res) {
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
