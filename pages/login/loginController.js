// login controller
angular.module("myApp")
    .controller("loginController", function ($scope, $http, $window, $rootScope) {
        // button click count
        $scope.login = function() {
            var user = {
                UserName: $scope.userName,
                Password: $scope.psw
            };

            $http.post('http://localhost:3000/login', user)
                .then(function(response){
                    if (response.data === "Invalid credentials.")
                        window.alert("user name or password are invalid");
                    else {
                        $scope.PostDataResponse = response.data;
                        $window.sessionStorage.setItem('userToken', response.data);
                        $rootScope.existsConnectedUser = true;
                        // $window.sessionStorage.setItem('userName', $scope.userName);
                        $rootScope.userName = $scope.userName;
                        // $rootScope.userToken = response.data;
                        console.log("SUCCESS LOGIN!");

                        $http({
                            method: "GET",
                            url: 'http://localhost:3000/private/getUserFavPOIList',
                            headers: {"Access-Control-Allow-Origin": "*",
                                "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
                                "x-auth-token": $window.sessionStorage.getItem("userToken")}
                        }).then(function mySuccess(response) {
                            let userFavPOIList = response.data;
                            let userFavPOIIDList = [];
                            for (let i = 0; i < userFavPOIList.length; i++) {
                                userFavPOIIDList.push(userFavPOIList[i].PointID);
                            }
                            $window.sessionStorage.setItem('userFavPOIList', userFavPOIIDList.toString());
                            console.log("Got the favorites list!");
                            window.location.href = "#!"
                        }
                        ,(function () {
                            console.log("Error when getting user favorites list");
                        }));

                        window.location.href = "#!"
                    }
                }
                ,(function () {
                    console.log("FAILURE LOGIN!");
                    window.alert("User Name Or Password Are Invalid");
                    $scope.ResponseDetails = "invalid login "
                }));
        };

    });