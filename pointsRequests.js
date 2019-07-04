var DButilsAzure = require('./DButils');
var dateFormat = require('dateformat');

// get2PopularPOI
exports.get2PopularPOI = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT p1.ID, p1.Name, p1.CategoryID, p1.Image, " +
        "p1.Viewers, p1.Description, p1.AverageRank " +
        "FROM Points as p1, UsersCategories as uc " +
        "WHERE p1.CategoryID = uc.CategoryID " +
        "AND p1.AverageRank >= all (SELECT p2.AverageRank " +
        "FROM Points p2 " +
        "WHERE p1.CategoryID = p2.CategoryID) " +
        "AND uc.UserID = '" + req.decoded.id + "'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// get2LastSavedPOI
exports.get2LastSavedPOI = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT top 2 * " +
        "FROM UsersPoints as up, Points as p " +
        "WHERE up.PointID = p.ID " +
        "AND up.UserID = '" + req.decoded.id + "' " +
        "ORDER BY up.Date desc")
        // "SELECT top 2 * " +
        // "FROM UsersPoints as up " +
        // "WHERE up.UserID = '" + req.decoded.id + "' " +
        // "ORDER BY up.Date desc")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getUserFavPOIList
exports.getUserFavPOIList = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM UsersPoints as up, Points as p " +
        "WHERE up.PointID = p.ID " +
        "AND up.UserID = '" + req.decoded.id + "'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getUserFavPOIListByName
exports.getUserFavPOIListByName = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points as p, UsersPoints as up " +
        "WHERE p.ID = up.PointID " +
        "AND p.Name LIKE '%" + req.params.name + "%' " +
        "AND up.UserID = '" + req.decoded.id + "'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// setUserSavedPOIList
exports.setUserSavedPOIList = async (req, res) => {
    let userID = req.decoded.id;
    let inputPointsList = req.body.Points;
    inputPointsList = inputPointsList.split(',');
    // DATETIME FORMAT: 1993-12-17 10:00:00
    let now = new Date();
    let datetime = dateFormat(now, "isoDateTime");
    datetime = datetime.replace('T',' ').split("+")[0];
    let valuesToInsert = "";
    for (let i = 0; i < inputPointsList.length; i++) {
        valuesToInsert += "('" + userID + "','" + inputPointsList[i] + "','" + datetime + "'),";
    }
    valuesToInsert = valuesToInsert.substr(0,valuesToInsert.length - 1);
    await DButilsAzure.execQuery(
        "DELETE FROM UsersPoints " +
        "WHERE UserID = '" + userID + "'")
        .then(function(result){
            // res.status(200).send({ result: "Points Deleted Successfully." });
            console.log("Erased previous points")
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
            res.status(400).send({ result: "Failed." });
        });
    await DButilsAzure.execQuery(
        "INSERT INTO UsersPoints " +
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
};

// getPOIInfo
exports.getPOIInfo = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points " +
        "WHERE id = '" + req.params.id + "'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getPOI2RecentReviews
exports.getPOI2RecentReviews = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT top 2 * " +
        "FROM Reviews " +
        "WHERE PointID = '" + req.params.id + "' " +
        "ORDER BY Date desc")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getPOIListByName
exports.getPOIListByName = (req, res) => {
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
};

// getAllPOI
exports.getAllPOI = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT * " +
        "FROM Points")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// get3RandomPOIs
exports.get3RandomPOIs = (req, res) => {
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
            res.send(pointsToReturn);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);Z
        })
};
