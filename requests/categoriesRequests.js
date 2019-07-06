var DButilsAzure = require('../DButils');

// getCategoryIDByCategoryName
exports.getCategoryIDByCategoryName = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT ID " +
        "FROM Categories " +
        "Where Name = '" + req.params.name + "'")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};

// getCategoryPOIs
exports.getCategoryPOIs = (req, res) => {
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
};

// getAllCategories
exports.getAllCategories = (req, res) => {
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
};

// getCategoryNameByCategoryID
exports.getCategoryNameByCategoryID = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT Name " +
        "FROM Categories " +
        "Where ID = " + req.params.id)
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};