const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const MongoClient = require('mongodb').MongoClient;

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

app.engine("hbs", exphbs());
app.set("view engine","hbs");

app.get('/', function (req, res) {
    console.log("Sending home page");
    res.status(200).render('index');
});

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
