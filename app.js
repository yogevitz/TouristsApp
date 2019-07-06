var express = require('express');
var app = express();
var jwt = require("jsonwebtoken");
// var dateFormat = require('dateformat');
var DButilsAzure = require('./DButils');
var userRequests = require('./requests/usersRequests');
var pointsRequests = require('./requests/pointsRequests');
var reviewsRequests = require('./requests/reviewsRequests');
var categoriesRequests = require('./requests/categoriesRequests');

var cors = require('cors');
app.use(cors());
app.use(express.json(), function(req, res, next) {
    express.json();
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json());
// app.use(express.urlencoded());

secret = "dracarys";

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

app.use((req, res, next) => {
    // console.log(req);
    next();
});

// private middleware
app.use("/private", (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        res.status(401).send("Access denied. No token provided.");
    }
    try {
        req.decoded = jwt.verify(token, secret);
        next();
        console.log("authenticated");
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
});

// login
app.post("/login", userRequests.login);

// register
app.post("/register", userRequests.register);

// restorePassword
app.post("/restorePassword", userRequests.restorePassword);

// getAllUsers
app.get('/private/getAllUsers', userRequests.getAllUsers);

// getUsersQuestions
app.get("/getUsersQuestions", userRequests.getUsersQuestions);

// get2RandomQuestions
app.get('/get2RandomQuestions', userRequests.get2RandomQuestions);

// get2PopularPOI
app.get('/private/get2PopularPOI', pointsRequests.get2PopularPOI);

// get2LastSavedPOI
app.get('/private/get2LastSavedPOI', pointsRequests.get2LastSavedPOI);

// getUserFavPOIList
app.get('/private/getUserFavPOIList', pointsRequests.getUserFavPOIList);

// getUserFavPOIListByName
app.get('/private/getUserFavPOIListByName/:name', pointsRequests.getUserFavPOIListByName);

// setUserSavedPOIList
app.post("/private/setUserSavedPOIList", pointsRequests.setUserSavedPOIList);

// getPOIInfo
app.get('/getPOIInfo/:id', pointsRequests.getPOIInfo);

// getPOI2RecentReviews
app.get('/getPOI2RecentReviews/:id', pointsRequests.getPOI2RecentReviews);

// getPOIListByName
app.get('/getPOIListByName/:name', pointsRequests.getPOIListByName);

app.get('/getAllPOI', pointsRequests.getAllPOI);

// get3RandomPOIs
app.get('/get3RandomPOIs', pointsRequests.get3RandomPOIs);

// getCategoryIDByCategoryName
app.get('/getCategoryIDByCategoryName/:name', categoriesRequests.getCategoryIDByCategoryName);

// getCategoryNameByCategoryID
app.get('/getCategoryNameByCategoryID/:id', categoriesRequests.getCategoryNameByCategoryID);

// getCategoryPOIs
app.get('/getCategoryPOIs/:categoryID', categoriesRequests.getCategoryPOIs);

// getAllCategories
app.get('/getAllCategories', categoriesRequests.getAllCategories);

// addReview
app.use('/private/addReview', reviewsRequests.addReview);
