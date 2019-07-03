// home controller
// var app = angular.module("myApp");

app.controller('homeController', ['$scope', '$http', '$rootScope', '$window', '$location', 'sharedProperties',
    function($scope, $http, $rootScope, $window, $location, sharedProperties) {

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

    if ($rootScope.existsConnectedUser) {

        // Get 2 Popular POI
        $http({
            method: "GET",
            url: 'http://localhost:3000/private/get2PopularPOI',
            headers: {"Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
                "x-auth-token": $window.sessionStorage.getItem("userToken")}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            // $scope.popularImage1Label = "";
            // $scope.popularImage1ID = "";
            // $scope.popularImage1Image = "";
            let popularImagesData = response.data;
            if (popularImagesData[0]) {
                let popularImage1Data = popularImagesData[0];
                $scope.popularImage1Label = popularImage1Data["Name"];
                $scope.popularImage1ID = popularImage1Data["ID"];
                $scope.popularImage1Image = "images" + popularImage1Data["Image"];
            }
            // $scope.popularImage2Label = "";
            // $scope.popularImage2ID = "";
            // $scope.popularImage2Image = "";
            if (popularImagesData[1]) {
                let popularImage2Data = popularImagesData[1];
                $scope.popularImage2Label = popularImage2Data["Name"];
                $scope.popularImage2ID = popularImage2Data["ID"];
                $scope.popularImage2Image = "images" + popularImage2Data["Image"];
            }
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });

        // Get 2 Last Saved POI
        $http({
            method: "GET",
            url: 'http://localhost:3000/private/get2LastSavedPOI',
            headers: {"Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
                "x-auth-token": $window.sessionStorage.getItem("userToken")}
        }).then(function mySuccess(response) {
            console.log("SUCCESS!");
            // $scope.lastSavedImage1Label = "";
            // $scope.lastSavedImage1ID = "";
            // $scope.lastSavedImage1Image = "";
            let lastSavedImagesData = response.data;
            if (lastSavedImagesData[0]) {
                let lastSavedImage1Data = lastSavedImagesData[0];
                $scope.lastSavedImage1Label = lastSavedImage1Data["Name"];
                $scope.lastSavedImage1ID = lastSavedImage1Data["ID"];
                $scope.lastSavedImage1Image = "images" + lastSavedImage1Data["Image"];
            }
            // $scope.lastSavedImage2Label = "";
            // $scope.lastSavedImage2ID = "";
            // $scope.lastSavedImage2Image = "";
            if (lastSavedImagesData[1]) {
                let lastSavedImage2Data = lastSavedImagesData[1];
                $scope.lastSavedImage2Label = lastSavedImage2Data["Name"];
                $scope.lastSavedImage2ID = lastSavedImage2Data["ID"];
                $scope.lastSavedImage2Image = "images" + lastSavedImage2Data["Image"];
            }
        }, function myError(response) {
            // debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });

    }



}]);