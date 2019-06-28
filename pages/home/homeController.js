// home controller
angular.module("myApp")
    .controller('homeController', ['$scope','$http', '$location', function($scope, $http, $location) {

        console.log('Home Controller');

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
            $scope.exploreImage1Image = "images" + exploreImage1Data["Image"];
            $scope.exploreImage2Image = "images" + exploreImage2Data["Image"];
            $scope.exploreImage3Image = "images" + exploreImage3Data["Image"];
        }, function myError(response) {
            debugger;
            console.log(response);
            console.log(response.data);
            console.log("FAILURE!");
            $scope.myWelcome = response.statusText;
        });


    }]);