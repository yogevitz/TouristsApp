// poi controller
angular.module("myApp")
.controller('httpController', function($scope, $http) {
    console.log('Yogev');
    $http({
        method: "get",
        url : "https://localhost:3000/get3RandomPOIs"
    }).then(function mySuccess(response) {
        console.log("SUCCESS!");
        $scope.myWelcome = response.data;
        }, function myError(response) {
        console.log(response);
        console.log(response.data);
        console.log("FAILURE!");
        $scope.myWelcome = response.statusText;
        });
    });


    //
    // $http.get('https://localhost:3000/get3RandomPOIs')
    //     .then(function(response) {
    //         console.log("Yogev2");
    //         console.log(response.data);
    //         $scope.myWelcome=response.data;
    // });
// });