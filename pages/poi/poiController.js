// poi controller
// var app = angular.module("myApp");

app.controller('poiController', ['$scope', '$http', '$rootScope', '$location', 'sharedProperties', function($scope, $http, $rootScope, $location, sharedProperties) {
    self = this;

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
    };

    $scope.openImage();

}]);