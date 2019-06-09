// poi controller
angular.module("myApp")
.controller("httpController", ($scope,$http) => {
    self = this;
    $http.get('http://localhost:3000/private/get2LastSavedPOI')
        .then((response) => {
            $scope.myWelcome=response.data;
    });
});