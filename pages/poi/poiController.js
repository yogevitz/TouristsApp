// poi controller
// var app = angular.module("myApp");

app.controller('poiController', ['$scope', '$http', '$location', sharedProperties, function($scope, $http, $location) {
    self = this;

    openImage(sharedProperties.getCurrentPointID());

    function openImage(id) {
        $http({
            method: "GET",
            url: 'http://localhost:3000/getPOIInfo/' + id,
            headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            let imageData = response.data;
            $scope.imageText = imageData;
            // $scope.exploreImage1Label = exploreImage1Data["Name"];
            // $scope.exploreImage2Label = exploreImage2Data["Name"];
            // $scope.exploreImage3Label = exploreImage3Data["Name"];
            // $scope.exploreImage1Image = "images" + exploreImage1Data["Image"];
            // $scope.exploreImage2Image = "images" + exploreImage2Data["Image"];
            // $scope.exploreImage3Image = "images" + exploreImage3Data["Image"];
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });
    }

}]);