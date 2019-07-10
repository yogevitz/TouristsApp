// http controller
angular.module("myApp")
.controller('httpController', ['$scope','$http', '$location','$window', function($scope, $http, $location, $window) {

    console.log('HTTP Controller');

    $scope.logout = function () {
        $window.location.reload();
    };

    $http({
        method: "GET",
        url: 'http://localhost:3000/get3RandomPOIs',
        headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
    }).then(function mySuccess(response) {
        console.log("SUCCESS!");
        $scope.myWelcome = response.data;
        $scope.explore = response.data;
    }, function myError(response) {
        console.log(response);
        console.log(response.data);
        console.log("FAILURE!");
        $scope.myWelcome = response.statusText;
    });


    }]);

    //
    // $http.get('https://localhost:3000/get3RandomPOIs')
    //     .then(function(response) {
    //         console.log("Yogev2");
    //         console.log(response.data);
    //         $scope.myWelcome=response.data;
    // });
// });