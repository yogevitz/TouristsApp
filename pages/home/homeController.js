// home controller
// var app = angular.module("myApp");

app.controller('homeController', ['$scope', '$http', '$rootScope', '$location', 'sharedProperties', function($scope, $http, $rootScope, $location, sharedProperties) {

    console.log('Home Controller');

    $scope.openPOI = function (id) {
        $rootScope.pointID = id;
    };

    $http({
        method: "GET",
        url: 'http://localhost:3000/get3RandomPOIs',
        headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
    }).then(function mySuccess(response) {
        console.log("SUCCESS!");
        let exploreImagesData = response.data;
        let exploreImage1Data = exploreImagesData[0];
        let exploreImage2Data = exploreImagesData[1];
        let exploreImage3Data = exploreImagesData[2];
        $scope.exploreImage1Label = exploreImage1Data["Name"];
        $scope.exploreImage2Label = exploreImage2Data["Name"];
        $scope.exploreImage3Label = exploreImage3Data["Name"];
        $scope.exploreImage1ID = exploreImage1Data["ID"];
        $scope.exploreImage2ID = exploreImage2Data["ID"];
        $scope.exploreImage3ID = exploreImage3Data["ID"];
        $scope.exploreImage1Image = "images" + exploreImage1Data["Image"];
        $scope.exploreImage2Image = "images" + exploreImage2Data["Image"];
        $scope.exploreImage3Image = "images" + exploreImage3Data["Image"];
    }, function myError(response) {
        // debugger;
        console.log(response);
        console.log(response.data);
        console.log("FAILURE!");
        $scope.myWelcome = response.statusText;
    });

    $http({
        method: "GET",
        url: 'http://localhost:3000/get3RandomPOIs',
        headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
    }).then(function mySuccess(response) {
        console.log("SUCCESS!");
        let exploreImagesData = response.data;
        let exploreImage1Data = exploreImagesData[0];
        let exploreImage2Data = exploreImagesData[1];
        let exploreImage3Data = exploreImagesData[2];
        $scope.exploreImage1Label = exploreImage1Data["Name"];
        $scope.exploreImage2Label = exploreImage2Data["Name"];
        $scope.exploreImage3Label = exploreImage3Data["Name"];
        $scope.exploreImage1ID = exploreImage1Data["ID"];
        $scope.exploreImage2ID = exploreImage2Data["ID"];
        $scope.exploreImage3ID = exploreImage3Data["ID"];
        $scope.exploreImage1Image = "images" + exploreImage1Data["Image"];
        $scope.exploreImage2Image = "images" + exploreImage2Data["Image"];
        $scope.exploreImage3Image = "images" + exploreImage3Data["Image"];
    }, function myError(response) {
        // debugger;
        console.log(response);
        console.log(response.data);
        console.log("FAILURE!");
        $scope.myWelcome = response.statusText;
    });

}]);