// poi controller
// var app = angular.module("myApp");

app.controller('browseController', ['$scope', '$http', '$rootScope', '$location', 'sharedProperties', function($scope, $http, $rootScope, $location, sharedProperties) {
    self = this;

    $scope.searchPoints = function () {
        console.log("Searching for: " + $scope.searchInput);
        // [{"ID":1,"Name":"Colosseum","Description":"The Colosseum and the Arch of Constantine",
        // "Image":"/Colosseum.jpg","CategoryID":4,"Viewers":30,"Rankers":20,"AverageRank":4.2}]
        $http({
            method: "GET",
            url: 'http://localhost:3000/getPOIListByName/' + $scope.searchInput,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            $scope.results = response.data;
            fillSearchResults();
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });
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

    // $scope.openImage();

}]);

function fillSearchResults() {

}