// poi controller
// var app = angular.module("myApp");

app.controller('browseController', ['$scope', '$http', '$rootScope', '$location', 'sharedProperties',
    function($scope, $http, $rootScope, $location, sharedProperties) {
    self = this;
    $scope.noBrowse = false;
    $scope.selectedCategoriesList = [];

    $scope.openPOI = function (id) {
        $rootScope.pointID = id;
    };

    $scope.searchPoints = function () {
        // console.log("Searching for: " + $scope.searchInput);
        // [{"ID":1,"Name":"Colosseum","Description":"The Colosseum and the Arch of Constantine",
        // "Image":"/Colosseum.jpg","CategoryID":4,"Viewers":30,"Rankers":20,"AverageRank":4.2}]
        if ($scope.searchInput == null || $scope.searchInput === "") {
            $scope.noBrowse = false;
            $scope.getAllPOIList();
        } else {
            $http({
                method: "GET",
                url: 'http://localhost:3000/getPOIListByName/' + $scope.searchInput,
                headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
            }).then(function mySuccess(response) {
                console.log("SUCCESS!");
                $scope.results = response.data;
                if (response.data.length === 0) {
                    $scope.noBrowse = true;
                } else {
                    $scope.noBrowse = false;
                }
                $scope.searchResultsPoints = response.data;
                $scope.searchResultsCategories = [];
                $scope.searchResultsCategories = [...new Set($scope.searchResultsPoints.map(x => x.CategoryID))];
                $scope.searchResultsCategoriesNames = [];
                for (let i = 0; i < $scope.searchResultsCategories.length; i++) {
                    $scope.addCategoryName(i, $scope.searchResultsCategories[i]);
                }
            }, function myError(response) {
                // debugger;
                console.log(response);
                console.log(response.data);
                console.log("FAILURE!");
                $scope.myWelcome = response.statusText;
            });
        }
    };

    $scope.addCategoryName = function (i, id) {
        $http({
            method: "GET",
            url: 'http://localhost:3000/getCategoryNameByCategoryID/' + id,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            let catData = response.data[0];
            $scope.searchResultsCategoriesNames.push({ID: id, Name: catData.Name});
            $scope.selectedCategoriesList.push({ID: id, Name: catData.Name});
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });
    };

    $scope.getAllPOIList = function () {
        $http({
            method: "GET",
            url: 'http://localhost:3000/getAllPOI',
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            $scope.results = response.data;
            $scope.searchResultsPoints = response.data;
            $scope.searchResultsCategories = [];
            $scope.searchResultsCategories = [...new Set($scope.searchResultsPoints.map(x => x.CategoryID))];
            $scope.searchResultsCategoriesNames = [];
            for (let i = 0; i < $scope.searchResultsCategories.length; i++) {
                $scope.addCategoryName(i, $scope.searchResultsCategories[i]);
            }
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });
    };

    $scope.changeCategories = function(category) {
        for (let i = 0; i < $scope.selectedCategoriesList.length; i++) {
            if ($scope.selectedCategoriesList[i].ID === category.ID) {
                $scope.selectedCategoriesList.splice(i, 1);
                return;
            }
        }
        $scope.selectedCategoriesList.push(category);
    };

    $scope.filterSelectedCategories = function (item) {
        for (let i = 0; i < $scope.selectedCategoriesList.length; i++) {
            if ($scope.selectedCategoriesList[i].ID === item.ID) {
                return true;
            }
        }
        return false;
    };

    $scope.filterSelectedCategoriesForRanks = function (item) {
        for (let i = 0; i < $scope.selectedCategoriesList.length; i++) {
            if ($scope.selectedCategoriesList[i].ID === item.CategoryID) {
                return true;
            }
        }
        return false;
    };

    $scope.openImage = function () {
        $http({
            method: "GET",
            url: 'http://localhost:3000/getPOIInfo/' + $rootScope.pointID,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            let pointData = response.data[0];
            $scope.pointName = pointData["Name"];
            $scope.pointImage = "images" + pointData["Image"];
            $scope.pointDescription = pointData["Description"];
            $scope.pointRankers = pointData["Rankers"];
            $scope.pointAverageRank = pointData["AverageRank"];
            $scope.pointViewers = pointData["Viewers"];
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });

        $http({
            method: "GET",
            url: 'http://localhost:3000/getPOI2RecentReviews/' + $rootScope.pointID,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            let pointReview1Data, pointReview2Data;
            $scope.review1Exists = false;
            $scope.review2Exists = false;
            $scope.noReviews = false;
            if (response.data[0] != null) {
                $scope.review1Exists = true;
                pointReview1Data = response.data[0];
                $scope.pointReview1Rank = pointReview1Data["Rank"];
                $scope.pointReview1Text = pointReview1Data["Text"];
                $scope.pointReview1Date = pointReview1Data["Date"].split("T")[0];
                if (response.data[1] != null) {
                    $scope.review2Exists = true;
                    pointReview2Data = response.data[1];
                    $scope.pointReview2Rank = pointReview2Data["Rank"];
                    $scope.pointReview2Text = pointReview2Data["Text"];
                    $scope.pointReview2Date = pointReview2Data["Date"].split("T")[0];
                }
            } else {
                $scope.noReviews = true;
            }
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });
    };

    $scope.searchPoints();

}]);

function fillSearchResults() {

}