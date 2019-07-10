var DButilsAzure = require('../DButils');

// getAllCountries
exports.getAllCountries = (req, res) => {
    DButilsAzure.execQuery(
        "SELECT Name " +
        "FROM Countries")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
};