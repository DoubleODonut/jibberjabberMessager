var fs = require("fs");
var MongoClient = require("mongodb").MongoClient;
var username = "INDE";
var password = "PfQBVUbXnKO52VB6";
var server = "indechat-shard-00-00-xw4m8.mongodb.net";
var port = 27017;
var dbname = "indeMongo";
var params = "ssl=true&authSource=admin"
var url = "mongodb://" + username + ":" + password + "@" + server + ":" + port + "/" + dbname + "?" + params;
var db;
var mqtt = require("mqtt");
var client = mqtt.connect("ws://broker.i-dat.org:8000/mqtt");
// var client = mqtt.connect("ws://test.mosquitto.org:8080/mqtt"); 
// var client = mqtt.connect("ws://10.212.43.21:1884/mqtt"); 

MongoClient.connect(url, function (error, database) {
    if (error) console.log("ERROR: " + error);
    else {
        db = database;
    };

});




var express = require('express')
var app = express()

app.use(express.static('public'));



app.get('/create', function (req, res)
            {
                res.sendFile(__dirname + '/public/add.html');
            });

var currentUser = {};

app.get('/login', function(req, res){
    var loginUsername = req.query.loginUsername;
    var loginPassword = req.query.loginPassword;
    people = db.collection("people").find({});
    people.forEach(function (person) {
        if (person.Username === loginUsername && person.Password === loginPassword) {
            
            var read = fs.readFileSync('public/message.html', 'utf8');
            read = read.replace('!currentUser!', loginUsername);
            res.send(read);
        }
    });
});

app.get('/add', function(req, res){
    res.setHeader("Content-Type", "text/html");
    var username = req.query.username;
    var firstname = req.query.firstname;
    var password = req.query.password;
    var lastname = req.query.lastname;
    var email = req.query.email;
    var dob = req.query.dob;
    var gender = req.query.gender;
    db.collection("people").insert({
        Username: username,
        Password: password,
        Firstname: firstname,
        Lastname: lastname,
        Email: email,
        Dob: dob,
        Gender: gender
    });

    res.write("Person added to database");
    res.end();
});

app.get('/profile', function (req, res) {
    res.setHeader("Content-Type", "text/html");
    var searchUser = req.query.username;
    people = db.collection("people").find({});
    people.forEach(function (person) {
        if (person.Username === searchUser) {
            res.write("Current User: " + person.Username + "<br>");
            res.write("Full Name: " + person.Firstname + " " + person.Lastname + "<br>");
            res.write("Email: " + person.Email + "<br>");
            res.write("DoB: " + person.Dob + "<br>");
            res.write("Gender: " + person.Gender + "<br>");
            res.end();
        }
    });
});
 
app.get('/remove', function(req, res){
    var removeUsername = req.query.removeUsername;
    var removePassword = req.query.removePassword;
    people = db.collection("people").find({});
    people.forEach(function (person) {
        if (person.Username === removeUsername && person.Password === removePassword) {
            db.collection("people").remove({
                    Username: removeUsername
            });
            
        }
    });
});

app.get('/update', function(req, res){
    var updateUsername = req.query.editUsername;
    var updatePassword = req.query.editPassword;
    var updateFirstname = req.query.editFirstname;
    var updateLastname = req.query.editLastname;
    var updateEmail = req.query.editEmail;
    var updateDob = req.query.editDob;
    var updateGender = req.query.editGender;
    
    people = db.collection("people").find({});
    people.forEach(function (person) {
        if (person.Username === updateUsername && person.Password === updatePassword) {
            db.collection("people").update({
                Firstname: person.Firstname
            }, { $set: {Firstname: updateFirstname } }
            );
            db.collection("people").update({
                Lastname: person.Lastname
            }, { $set: {Lastname: updateLastname } }
            );
            db.collection("people").update({
                Email: person.Email
            }, { $set: {Email: updateEmail } }
            );
            db.collection("people").update({
                Dob: person.Dob
            }, { $set: {Dob: updateDob } }
            );
            db.collection("people").update({
                Gender: person.Gender
            }, { $set: {Gender: updateGender } }
            );
        }        
    });
});

    
        
        
    app.listen(8888, function(){
    console.log('example app listening on port 8888')
});
