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

// // register - get new user ID
// exports.register = async (req, res) => {
//
//     // Validate the given UserName and Email
//     await registerValidateUserNameAndEmail(req, res);
//
//     // Get the new user ID
//     await registerGetNewUserID(req, res);
//
//     // Insert into Users table
//     await registerInsertNewUser(req, res);
//
//     // Insert into UsersCategories table
//     await registerInsertNewUsersCategories(req, res);
//
//     // Insert into UsersQuestionsAnswers table
//     await registerInsertNewUsersQuestionsAnswers(req, res);
//
// };

exports.register = async (req, res) => {

    // Check if the UserName or the Email already exists
    await DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Users " +
        "WHERE UserName = '" + req.body.UserName + "' OR " +
        "Email = '" + req.body.Email + "'")
        .then(function (result, err) {
            if (result[0].c > 0) {
                console.log(err);
            } else {
                console.log("Valid UserName and Email");
            }
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
            // res.status(400).send({result: "Failed."});
        });

    // Get the new user ID
    await DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Users")
        .then(function (result) {
            req.userID = 1 + result[0].c;
        })
        .catch(function (err) {
            console.log(err);
            res.send(err)
        });

    // Insert into Users table
    await DButilsAzure.execQuery(
        "INSERT INTO Users" +
        "(ID,UserName,Password,FirstName,LastName,City,CountryID,Email,Admin) " +
        "VALUES (" +
        "'" + req.userID + "'," +
        "'" + req.body.UserName + "'," +
        "'" + req.body.Password + "'," +
        "'" + req.body.FirstName + "'," +
        "'" + req.body.LastName + "'," +
        "'" + req.body.City + "'," +
        "'" + req.body.CountryID + "'," +
        "'" + req.body.Email + "'," +
        "'" + 0 + "'" +
        ")")
        .then(function (result) {
            console.log("Inserted a new row to the Users table.")
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
            // res.status(400).send({result: "Failed."});
        });

    // Insert into UsersCategories table
    let inputCategoriesList = req.body.CategoriesList;
    // [1,2,5]
    let valuesToInsert = "";
    for (let i = 0; i < inputCategoriesList.length; i++) {
        valuesToInsert += "('" + req.userID + "','" + inputCategoriesList[i] + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0, valuesToInsert.length - 1);
    await DButilsAzure.execQuery(
        "INSERT INTO UsersCategories" +
        "(UserID,CategoryID) " +
        "VALUES " + valuesToInsert)
        .then(function (result) {
            console.log("Inserted a new row to the UsersCategories table.")
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
            // res.status(400).send({result: "Failed."});
        });

    // Insert into UsersQuestionsAnswers table
    // "AnswersList": [{"QuestionID": 1, "Answer": "Casper"},{"QuestionID": 2, "Answer": "Yael"}]
    let inputAnswersList = req.body.AnswersList;
    valuesToInsert = "";
    for (let i = 0; i < inputAnswersList.length; i++) {
        let question = inputAnswersList[i].QuestionID;
        let answer = inputAnswersList[i].Answer;
        valuesToInsert += "('" + req.userID + "','" + question + "','" + answer + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0, valuesToInsert.length - 1);
    await DButilsAzure.execQuery(
        "INSERT INTO UsersQuestionsAnswers" +
        "(UserID,QuestionID,Answer) " +
        "VALUES " + valuesToInsert)
        .then(function (result) {
            console.log("Inserted a new row to the UsersQuestionsAnswers table.");
            // res.status(200);
            res.status(200).send({result: "Registered Successfully."});
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
            // res.status(400).send({result: "Failed."});
        })

};

//
// registerValidateUserNameAndEmail = (req, res) => {
//     if (firstTime1) {
//         firstTime1 = false;
//         DButilsAzure.execQuery(
//             "SELECT Count(*) c FROM Users " +
//             "WHERE UserName = '" + req.body.UserName + "' OR " +
//             "Email = '" + req.body.Email + "'")
//             .then(function (result, err) {
//                 if (result[0].c > 0) {
//                     console.log(err);
//                     // res.send(err);
//                     // res.status(400).send({ result: "Failed." });
//                 }
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 res.send(err);
//                 // res.status(400).send({result: "Failed."});
//             });
//     }
// };
//
// registerGetNewUserID = (req, res) => {
//     if (firstTime2) {
//         firstTime2 = false;
//         let newUserID;
//         DButilsAzure.execQuery(
//             "SELECT Count(*) c FROM Users")
//             .then(function (result) {
//                 newUserID = 1 + result[0].c;
//                 req.userID = newUserID;
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 res.send(err)
//             });
//     }
// };
//
// // register - add user to the Users table
// registerInsertNewUser = (req, res) => {
//     if (firstTime3) {
//         firstTime3 = false;
//         let newUserID = req.userID;
//         let inputUserName = req.body.UserName;
//         let inputPassword = req.body.Password;
//         let inputFirstName = req.body.FirstName;
//         let inputLastName = req.body.LastName;
//         let inputCity = req.body.City;
//         let inputCountryID = req.body.CountryID;
//         let inputEmail = req.body.Email;
//         let isAdmin = 0;
//         DButilsAzure.execQuery(
//             "INSERT INTO Users" +
//             "(ID,UserName,Password,FirstName,LastName,City,CountryID,Email,Admin) " +
//             "VALUES (" +
//             "'" + newUserID + "'," +
//             "'" + inputUserName + "'," +
//             "'" + inputPassword + "'," +
//             "'" + inputFirstName + "'," +
//             "'" + inputLastName + "'," +
//             "'" + inputCity + "'," +
//             "'" + inputCountryID + "'," +
//             "'" + inputEmail + "'," +
//             "'" + isAdmin + "'" +
//             ")")
//             .then(function (result) {
//                 console.log("Inserted a new row to the Users table.")
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 res.send(err);
//                 // res.status(400).send({result: "Failed."});
//             })
//     }
// };
//
// // register - add categories to UsersCategories
// registerInsertNewUsersCategories = (req, res) => {
//     if (firstTime4) {
//         firstTime4 = false;
//         let newUserID = req.userID;
//         let inputCategoriesList = req.body.CategoriesList;
//         // [1,2,5]
//         var valuesToInsert = "";
//         for (let i = 0; i < inputCategoriesList.length; i++) {
//             valuesToInsert += "('" + newUserID + "','" + inputCategoriesList[i] + "'),";
//         }
//         valuesToInsert = valuesToInsert.substr(0, valuesToInsert.length - 1);
//         DButilsAzure.execQuery(
//             "INSERT INTO UsersCategories" +
//             "(UserID,CategoryID) " +
//             "VALUES " + valuesToInsert)
//             .then(function (result) {
//                 console.log("Inserted a new row to the UsersCategories table.")
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 res.send(err);
//                 // res.status(400).send({result: "Failed."});
//             })
//     }
// };

// // register - add the user's answers to UsersQuestionsAnswers
// registerInsertNewUsersQuestionsAnswers = (req, res) => {
//     if (firstTime5) {
//         firstTime5 = false;
//         let newUserID = req.userID;
//         // "AnswersList": [{"QuestionID": 1, "Answer": "Casper"},{"QuestionID": 2, "Answer": "Yael"}]
//         let inputAnswersList = req.body.AnswersList;
//         let valuesToInsert = "";
//         for (let i = 0; i < inputAnswersList.length; i++) {
//             let question = inputAnswersList[i].QuestionID;
//             let answer = inputAnswersList[i].Answer;
//             valuesToInsert += "('" + newUserID + "','" + question + "','" + answer + "'),";
//         }
//         valuesToInsert = valuesToInsert.substr(0, valuesToInsert.length - 1);
//         DButilsAzure.execQuery(
//             "INSERT INTO UsersQuestionsAnswers" +
//             "(UserID,QuestionID,Answer) " +
//             "VALUES " + valuesToInsert)
//             .then(function (result) {
//                 console.log("Inserted a new row to the UsersQuestionsAnswers table.");
//                 res.status(200);
//                 res.status(200).send({result: "Registered Successfully."});
//             })
//             .catch(function (err) {
//                 console.log(err);
//                 res.send(err);
//                 // res.status(400).send({result: "Failed."});
//             })
//     }
// };

// restorePassword
exports.restorePassword = async (req, res) => {
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
    await DButilsAzure.execQuery(
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
            result.length > 0 ? res.send(result[0]) : res.status(200).send("Invalid Question/Answer.");
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