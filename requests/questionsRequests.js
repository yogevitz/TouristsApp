var DButilsAzure = require('../DButils');

// getAllQuestions
exports.getAllQuestions = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT Text " +
        "FROM Questions")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};
