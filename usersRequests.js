var DButilsAzure = require('./DButils');
var jwt = require("jsonwebtoken");

// login
exports.login = (req, res) => {
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
};

// register - get new user ID
exports.register = (req, res) => {
    var newUserID;
    DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Users")
        .then(function(result){
            newUserID = 1 + result[0].c;
            req.userID = newUserID;
            register2(req, res);
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        });
};

// register - add user to the Users table
register2 = (req, res) => {
    let newUserID = req.userID;
    let inputUserName = req.body.UserName;
    let inputPassword = req.body.Password;
    let inputFirstName = req.body.FirstName;
    let inputLastName = req.body.LastName;
    let inputCity = req.body.City;
    let inputCountryID = req.body.CountryID;
    let inputEmail = req.body.Email;
    let isAdmin = 0;
    DButilsAzure.execQuery(
        "INSERT INTO Users" +
        "(ID,UserName,Password,FirstName,LastName,City,CountryID,Email,Admin) " +
        "VALUES (" +
        "'" + newUserID + "'," +
        "'" + inputUserName + "'," +
        "'" + inputPassword + "'," +
        "'" + inputFirstName + "'," +
        "'" + inputLastName + "'," +
        "'" + inputCity + "'," +
        "'" + inputCountryID + "'," +
        "'" + inputEmail + "'," +
        "'" + isAdmin + "'" +
        ")")
        .then(function(result){
            register3(req, res);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
};

// register - add categories to UsersCategories
register3 = (req, res) => {
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
            register4(req, res);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
};

// register - add the user's answers to UsersQuestionsAnswers
register4 = (req, res) => {
    let newUserID = req.userID;
    // "AnswersList": [{"QuestionID": 1, "Answer": "Casper"},{"QuestionID": 2, "Answer": "Yael"}]
    let inputAnswersList = req.body.AnswersList;
    let valuesToInsert = "";
    for (let i = 0; i < inputAnswersList.length; i++) {
        let question = inputAnswersList[i].QuestionID;
        let answer = inputAnswersList[i].Answer;
        valuesToInsert += "('" + newUserID + "','" + question + "','" + answer + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0,valuesToInsert.length - 1);
    DButilsAzure.execQuery(
        "INSERT INTO UsersQuestionsAnswers" +
        "(UserID,QuestionID,Answer) " +
        "VALUES " + valuesToInsert)
        .then(function(result){
            res.status(200).send({ result: "Registered Successfully." });
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        })
};

// restorePassword
exports.restorePassword = (req, res) => {
    let inputUserName = req.body.UserName;
    // "AnswersList": [{"QuestionID": 1, "Answer": "Casper"},{"QuestionID": 2, "Answer": "Yael"}]
    let inputAnswersList = req.body.AnswersList;
    let q1, a1, q2, a2;
    q1 = inputAnswersList[0].QuestionID;
    a1 = inputAnswersList[0].Answer;
    if (inputAnswersList.length === 1) {
        q2 = q1;
        a2 = a1;
    }
    else {
        q2 = inputAnswersList[1].QuestionID;
        a2 = inputAnswersList[1].Answer;
    }
    DButilsAzure.execQuery(
        "SELECT u.Password " +
        "FROM Users as u " +
        "WHERE UserName = '" + inputUserName + "' " +
        "AND EXISTS " +
        "(SELECT * FROM UsersQuestionsAnswers WHERE UserID = u.ID " +
        "AND QuestionID = '" + q1 + "' AND Answer = '" + a1 + "') " +
        "AND EXISTS " +
        "(SELECT * FROM UsersQuestionsAnswers WHERE UserID = u.ID " +
        "AND QuestionID = '" + q2 + "' AND Answer = '" + a2 + "')")
        .then(function(result){
            result.length > 0 ? res.send(result[0]) : res.status(400).send("Invalid Question/Answer.");
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getAllUsers
exports.getAllUsers = (req, res) => {
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
};

// getUsersQuestions
exports.getUsersQuestions = (req, res) => {
    let inputUserName = req.body.UserName;
    DButilsAzure.execQuery("SELECT Text " +
        "FROM Questions as q " +
        "WHERE q.ID in ( " +
        "SELECT QuestionID " +
        "FROM UsersQuestionsAnswers " +
        "WHERE UserID = ( " +
        "SELECT ID " +
        "FROM Users " +
        "WHERE UserName = '" + inputUserName + "' " +
        ") " +
        ")")
        .then(function(result) {
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// get2RandomQuestions
exports.get2RandomQuestions = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Questions")
        .then(function(result) {
            let rnd;
            let numberOfQuestionsToReturn = Math.min(2, result.length);
            let questionsToReturn = [];
            while (questionsToReturn.length < numberOfQuestionsToReturn) {
                rnd = Math.floor(Math.random() * result.length);
                if (!questionsToReturn.includes(result[rnd]))
                    questionsToReturn.push(result[rnd]);
            }
            res.send(questionsToReturn)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};