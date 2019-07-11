// poi controller
// var app = angular.module("myApp");

app.controller('poiController', ['$scope', '$http', '$rootScope', '$window', '$location', 'sharedProperties', function($scope, $http, $rootScope, $window, $location, sharedProperties) {
    self = this;

    $scope.ranks = [
        "1",
        "2",
        "3",
        "4",
        "5"
    ];

    $scope.openImage = async function () {
        await $http({
            method: "GET",
            url: 'http://localhost:3000/getPOIInfo/' + $rootScope.pointID,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
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

        await $http({
            method: "GET",
            url: 'http://localhost:3000/getPOI2RecentReviews/' + $rootScope.pointID,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
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
        let pointID = {ID: $rootScope.pointID};
        await $http({
            method: "POST",
            url: 'http://localhost:3000/addViewers',
            data: pointID,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            // window.alert("Added Viewers!");
            // let resultData = response.data[0];
        }, function myError(response){
            console.log(response);
            console.log("FAILURE Added Viewers!");
        });

    };

    $scope.openImage();

    $scope.addReviews = function () {
        let reviewData = {
            PointID: $rootScope.pointID,
            ReviewText: $scope.review,
            ReviewRank: $scope.rank
        };
        $http({
            method: "POST",
            url: 'http://localhost:3000/private/addReview',
            data: reviewData,
            headers: {"Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
                "x-auth-token": $window.sessionStorage.getItem("userToken")}
        }).then(function mySuccess(response) {
            window.alert("Review added successfully!");
            $scope.close();
        }, function myError(response) {
            console.log(response);
            console.log("FAILURE!");
        });
    };

}]);