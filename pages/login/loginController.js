// login controller
angular.module("myApp")
    .controller("loginController", function ($scope, $http) {
        // button click count
        $scope.login = function() {
            var user = {
                UserName: $scope.userName,
                Password: $scope.psw
            };
            //{ headers: {"x-auth-token":$rootScope.userToken}}

            $http.post('http://localhost:3000/login',user )
                .then(function(response){
                    if(response.data == "Invalid credentials.")
                        window.alert("user name or password are invalid");
                    else{
                        $scope.PostDataResponse = response.data;
                        console.log("SUCCESS LOGIN!");
                        window.location.href = "#!"
                    }
                    // check here if insert successfully
                })
                .error(function () {
                    console.log("FAILURE LOGIN!");
                    $scope.ResponseDetails = "invalid login "
                });
        };

    });