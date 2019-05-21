var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var body = require('body-parser');

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

// getAllUsers
app.get('/getAllUsers', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM Users")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getPOIInfo
app.get('/getPOIInfo/:id', function(req, res) {
    DButilsAzure.execQuery("SELECT * FROM Points Where id = " + req.params.id)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// login
app.post("/login", (req, res, next) => {
    let inputUserName = req.body.UserName;
    // let inputPassword = req.body.Password;
    console.log(inputUserName);
    let legalUser = false;
    // DButilsAzure.execQuery("SELECT UserName, Passwo  rd FROM Users")
    //     .then(function(result){
    //         for (let i = 0; i < result.length; i++) {
    //             if (result[i].UserName === inputUserName
    //                 && result[i].Password === inputPassword) {
    //                 legalUser = true;
    //             }
    //         }
    //         res.send(legalUser);
    //     })
    //     .catch(function(err){
    //         console.log(err);
    //         res.send(err)
    //     })
});

// restorePassword
app.post("/restorePassword/:username/:question/:answer", (req, res) => {
    let inputUserName = req.params.username;
    let inputQuestion = req.params.question;
    let inputAnswer = req.params.answer;
    let legalUser = false;
    DButilsAzure.execQuery("SELECT UserName, Question, Answer, Password FROM Users")
        .then(function(result){
            for (let i = 0; i < result.length; i++) {
                if (result[i].UserName === inputUserName
                    && result[i].Password === inputPassword) {
                    legalUser = true;
                }
            }
            res.send(legalUser);
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});


