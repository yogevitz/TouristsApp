var DButilsAzure = require('./DButils');
var dateFormat = require('dateformat');

// addReview
exports.addReview = (req, res) => {
    var newReviewID;
    DButilsAzure.execQuery(
        "SELECT Count(*) c FROM Reviews")
        .then(function(result){
            newReviewID = 1 + result[0].c;
            req.reviewID = newReviewID;
            console.log("add 1 done");
            addReview2(req, res);
        })
        .catch(function(err){
            console.log("add 1 failed");
            console.log(err);
            res.send(err)
        });
};

// addReview
addReview2 = (req, res) => {
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
        "INSERT INTO Reviews(ID,PointID,UserID,Text,Date,Rank) " +
        "VALUES (" +
        "'" + newReviewID + "'," +
        "'" + inputPointID + "'," +
        "'" + userID + "'," +
        "'" + inputReviewText + "'," +
        "'" + datetime + "'," +
        "'" + inputReviewRank +
        "')")
        .then(function(result){
            console.log("add 2 done");
            addReview3(req, res);
        })
        .catch(function(err){
            console.log("add 2 failed");
            console.log(err);
            res.send(err);
            res.status(200).send({ result: "Failed." });
        })
};

// addReview - increase Points.Rankers field by one
addReview3 = (req, res) => {
    let inputPointID = req.body.PointID;
    let inputReviewRank = req.body.ReviewRank;

    DButilsAzure.execQuery(
        "UPDATE Points " +
        "SET AverageRank = (((AverageRank * Rankers) + '" + inputReviewRank + "') / (Rankers + 1)), " +
        "Rankers = Rankers + 1 " +
        "WHERE ID = '" + inputPointID + "'")
        .then(function(result){
            console.log("add 3 done");
            res.status(200).send({ result: "Review Submitted Successfully." });
        })
        .catch(function(err){
            console.log("add 3 failed");
            console.log(err);
            res.send(err);
            res.status(200).send({ result: "Failed." });
        })
};
