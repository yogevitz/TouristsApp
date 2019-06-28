// poi controller
angular.module("myApp")
.controller('httpController', ['$scope','$http', '$location', function($scope, $http, $location) {
    console.log('Yogev');
    $http({
        method: "GET",
        url : 'https://localhost:3000/get3RandomPOIs',
        headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
    }).then(function mySuccess(response) {
        console.log("SUCCESS!");
        $scope.myWelcome = response.data;
        }, function myError(response) {
        debugger;
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