var express = require('express');
var app = express();
var jwt = require("jsonwebtoken");
var dateFormat = require('dateformat');
var DButilsAzure = require('./DButils');
// var body = require('body-parser');

app.use(express.json());
// app.use(express.urlencoded());

secret = "dracarys";

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

// login
app.post("/login", (req, res) => {
    let inputUserName = req.body.UserName;
    let inputPassword = req.body.Password;
    DButilsAzure.execQuery(
        "SELECT ID, Admin " +
        "FROM Users " +
        "WHERE UserName = '" + inputUserName + "'" +
        " AND Password = '" + inputPassword + "'")
        .then(function(result){
            if (result.length > 0) {
                payload = { id: result[0].ID, username: inputUserName, admin: result[0].Admin };
                options = { expiresIn: "1d" };
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            } else {
                res.status(400).send("Invalid credentials.");
            }
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// register - get new user ID - DONE
app.use("/register", (req, res, next) => {
    var newUserID;
    DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Users")
        .then(function(result){
            newUserID = 1 + result[0].c;
            req.userID = newUserID;
            next();
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        });
});

// register - add user to the Users table - DONE
app.post("/register", (req, res, next) => {
    let newUserID = req.userID;
    let inputUserName = req.body.UserName;
    let inputPassword = req.body.Password;
    let inputFirstName = req.body.FirstName;
    let inputLastName = req.body.LastName;
    let inputCity = req.body.City;
    let inputCountryID = req.body.CountryID;
    let inputEmail = req.body.Email;
    let inputQuestion = req.body.Question;
    let inputAnswer = req.body.Answer;
    let isAdmin = 0;
    DButilsAzure.execQuery(
        "INSERT INTO Users" +
        "(ID,UserName,Password,FirstName,LastName,City,CountryID,Email,Question,Answer,Admin) " +
        "VALUES (" +
        "'" + newUserID + "'," +
        "'" + inputUserName + "'," +
        "'" + inputPassword + "'," +
        "'" + inputFirstName + "'," +
        "'" + inputLastName + "'," +
        "'" + inputCity + "'," +
        "'" + inputCountryID + "'," +
        "'" + inputEmail + "'," +
        "'" + inputQuestion + "'," +
        "'" + inputAnswer + "'" +
        "'" + isAdmin + "'" +
        ")")
        .then(function(result){
            next();
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
});

// register - add categories to UsersCategories - DONE
app.post("/register", (req, res, next) => {
    let newUserID = req.userID;
    let inputCategoriesList = req.body.CategoriesList;
    let valuesToInsert = "";
    for (let i = 0; i < inputCategoriesList.length; i++) {
        valuesToInsert += "('" + newUserID + "','" + inputCategoriesList[i] + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0,valuesToInsert.length - 1);
    DButilsAzure.execQuery(
        "INSERT INTO UsersCategories" +
        "(UserID,CategoryID) " +
        "VALUES " + valuesToInsert)
        .then(function(result){
            res.status(200).send({ result: "Registered Successfully." });
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
});

// restorePassword - DONE
app.post("/restorePassword", (req, res) => {
    let inputUserName = req.body.UserName;
    let inputQuestion = req.body.Question;
    let inputAnswer = req.body.Answer;
    DButilsAzure.execQuery(
        "SELECT Password " +
        "FROM Users " +
        "WHERE UserName = '" + inputUserName + "'" +
        " AND Question = '" + inputQuestion + "'" +
        " AND Answer = '" + inputAnswer + "'")
        .then(function(result){
            result.length > 0 ? res.send(result[0]) : res.status(400).send("Invalid Question/Answer.");
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});





// ----------------------------------------------------------------------------------------

// check token from private requests - DONE
app.use("/private", (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        res.status(401).send("Access denied. No token provided.");
    }
    try {
        req.decoded = jwt.verify(token, secret);
        next();
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }

});

// get2PopularPOI - DONE
app.get('/private/get2PopularPOI', (req, res) => {
    DButilsAzure.execQuery(
        "select * " +
        "from Points " +
        "where ID in (select top 2 ID " +
        "from Points as p, UsersCategories as uc " +
        "where uc.CategoryID = p.CategoryID " +
        "and uc.UserID = " + req.decoded.username +
        " order by p.ViewersNumber desc)")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getAllUsers - DONE
app.get('/private/getAllUsers', (req, res) => {
    if (!req.decoded.admin) {
        res.status(401).send("Access denied. Not an admin.");
    }
    DButilsAzure.execQuery("SELECT * FROM Users")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// get2LastSavedPOI - DONE
app.get('/private/get2LastSavedPOI', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT top 2 * " +
        "FROM UsersPoints " +
        "WHERE UserID = " + req.decoded.username +
        "ORDER BY Date desc")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getUserFavPOIList - DONE
app.get('/private/getUserFavPOIList', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM UsersPoints " +
        "WHERE UserID = " + req.decoded.username)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// setUserSavedPOIList - DONE
app.post("/private/setUserSavedPOIList", (req, res) => {
    let userID = req.decoded.id;
    let inputPointsList = req.body.Points;
    // DATETIME FORMAT: 1993-12-17 10:00:00
    let now = new Date();
    let datetime = dateFormat(now, "isoDateTime");
    datetime = datetime.replace('T',' ').split("+")[0];
    let valuesToInsert = "";
    for (let i = 0; i < inputPointsList.length; i++) {
        valuesToInsert += "('" + userID + "','" + inputPointsList[i] + "','" + datetime + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0,valuesToInsert.length - 1);
    DButilsAzure.execQuery(
        "INSERT INTO UsersPoints" +
        "(UserID,PointID,Date) " +
        "VALUES " + valuesToInsert)
        .then(function(result){
            res.status(200).send({ result: "Points Added Successfully." });
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
});

// addReview
app.use("/private/addReview", (req, res, next) => {
    var newReviewID;
    DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Reviews")
        .then(function(result){
            newReviewID = 1 + result[0].c;
            req.reviewID = newReviewID;
            next();
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        });
});

// addReview
app.post("/private/addReview", (req, res) => {
    let newReviewID = req.reviewID;
    let inputPointID = req.body.PointID;
    let userID = req.decoded.id;
    let inputReviewText = req.body.ReviewText;
    let inputReviewRank = req.body.ReviewRank;
    // DATETIME FORMAT: 1993-12-17 10:00:00
    let now = new Date();
    let datetime = dateFormat(now, "isoDateTime");
    datetime = datetime.replace('T',' ').split("+")[0];
    DButilsAzure.execQuery(
        "INSERT INTO Reviews" +
        "(ID,PointID,UserID,Text,Date,Rank) " +
        "VALUES (" +
        "'" + newReviewID + "'," +
        "'" + inputPointID + "'," +
        "'" + userID + "'," +
        "'" + inputReviewText + "'," +
        "'" + datetime + "'," +
        "'" + inputReviewRank +
        "')")
        .then(function(result){
            res.status(200).send({ result: "Review Submitted Successfully." });
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
});

// ----------------------------------------------------------------------------------------




// getPOIInfo
// TODO: Return the two most recent reviews
app.get('/getPOIInfo/:id', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points " +
        "WHERE id = " + req.params.id)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getCategoryIDByCategoryName - DONE
app.get('/getCategoryIDByCategoryName/:name', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT ID " +
        "FROM Categories " +
        "Where Name = " + req.params.name)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getCategoryPOIs - DONE
app.get('/getCategoryPOIs/:categoryID', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points " +
        "Where CategoryID = " + req.params.categoryID)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })

    // let categoryID = 0;
    // DButilsAzure.execQuery(
    //     "SELECT ID " +
    //     "FROM Categories " +
    //     "WHERE Name = " + req.params.categoryName)
    //     .then((result) => {
    //         categoryID = result;
    //     })
    //     .then((categoryID) => {
    //         DButilsAzure.execQuery(
    //             "SELECT * " +
    //             "FROM Points " +
    //             "Where ID = " + categoryID)
    //             .then((result2) => {
    //                 res.send(result2)
    //             })
    //     })
    //     .catch(function(err){
    //         console.log(err);
    //         res.send(err);
    //     });



});

// getAllCategories - DONE
app.get('/getAllCategories', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT Name " +
        "FROM Categories")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// getPOIListByName - DONE
app.get('/getPOIListByName/:name', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points " +
        "WHERE Name LIKE '%" + req.params.name + "%'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});

// get3RandomPOIs - DONE
app.get('/get3RandomPOIs', (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points")
        .then(function(result) {
            let rnd;
            let numberOfPOIsToReturn = Math.min(3, result.length);
            let pointsToReturn = [];
            while (pointsToReturn.length < numberOfPOIsToReturn) {
                rnd = Math.floor(Math.random() * result.length);
                if (!pointsToReturn.includes(result[rnd]))
                    pointsToReturn.push(result[rnd]);
            }
            res.send(pointsToReturn)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});






