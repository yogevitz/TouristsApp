// poi controller
// var app = angular.module("myApp");

app.controller('favoritesController', ['$scope', '$http', '$rootScope', '$window', '$location', 'sharedProperties',
    function($scope, $http, $rootScope, $window, $location, sharedProperties) {
    self = this;
    $scope.noFavorites = false;

        $scope.openPOI = function (id) {
            $rootScope.pointID = id;
        };

        $scope.showFavPOIList = async function () {
            let tmp = $window.sessionStorage.getItem('userFavPOIList');
            if (!tmp || tmp.length < 1) {
                return;
            }
            let currentFavPOIList = tmp.split(",");
            if (currentFavPOIList.length === 0) {
                $scope.noFavorites = true;
            } else {
                $scope.noFavorites = false;
                $scope.favPoints = [];
                for (let i = 0; i < currentFavPOIList.length; i++) {
                    let pointID = parseInt(currentFavPOIList[i]);
                    await $http({
                        method: "GET",
                        url: 'http://localhost:3000/getPOIInfo/' + currentFavPOIList[i],
                        headers: {"Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
                    }).then(function mySuccess(response) {
                        console.log("SUCCESS!");
                        let resultData = response.data[0];
                        let pointName = resultData["Name"];
                        let pointImage = resultData["Image"];
                        let pointCategoryID = resultData["CategoryID"];
                        let pointAverageRank = resultData["AverageRank"];
                        let tmpPointInfo = {ID: pointID, CategoryID: pointCategoryID, Name: pointName, Image: pointImage, AverageRank: pointAverageRank};
                        $scope.favPoints.push(tmpPointInfo);
                    }, function myError(response) {
                        console.log(response);
                        console.log("FAILURE!");
                    });
                }
                $scope.favPointsCategories = [];
                $scope.favPointsCategoriesName = [];
                $scope.favPointsCategories = [...new Set($scope.favPoints.map(x => x.CategoryID))];
                for (let i = 0; i < $scope.favPointsCategories.length; i++) {
                    let tmpCategoryID = $scope.favPointsCategories[i];
                    await $http({
                        method: "GET",
                        url: 'http://localhost:3000/getCategoryNameByCategoryID/' + tmpCategoryID,
                        headers: {"Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
                    }).then(function mySuccess(response) {
                        let catData = response.data[0];
                        let tmpCategoryName = catData.Name;
                        $scope.favPointsCategoriesName.push({ID: tmpCategoryID, Name: tmpCategoryName});
                    }, function myError(response) {
                        console.log(response);
                        console.log(response.data);
                        console.log("FAILURE!");
                        $scope.myWelcome = response.statusText;
                    });
                }
            }
        };

        $scope.getPointInfo = function (pointID) {
            $http({
                method: "GET",
                url: 'http://localhost:3000/getPOIInfo/' + pointID,
                headers: {"Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
            }).then(function mySuccess(response) {
                console.log("SUCCESS!");
                let resultData = response.data[0];
                let pointName = resultData["Name"];
                let pointImage = resultData["Image"];
                let pointCategoryID = resultData["CategoryID"];
                let pointAverageRank = resultData["AverageRank"];
                let tmpPointInfo = {ID: pointID, CategoryID: pointCategoryID, Name: pointName, Image: pointImage, AverageRank: pointAverageRank};
                $scope.favPoints.push(tmpPointInfo);
            }, function myError(response) {
                console.log(response);
                console.log(response.data);
                console.log("FAILURE!");
            });
        };

        $scope.getCategoryName = function (id) {
            $http({
                method: "GET",
                url: 'http://localhost:3000/getCategoryNameByCategoryID/' + id,
                headers: {"Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
            }).then(function mySuccess(response) {
                let catData = response.data[0];
                return catData.Name;
            }, function myError(response) {
                console.log(response);
                console.log(response.data);
                console.log("FAILURE!");
                $scope.myWelcome = response.statusText;
            });
        };

        $scope.changeFavorites = function(pointID) {
            let wasFavorite = false;
            let tmp = $window.sessionStorage.getItem('userFavPOIList');
            let oldFavPOIList = tmp.split(",");
            let newFavPOIList = [];
            for (let i = 0; i < oldFavPOIList.length; i++) {
                let tmpPOI = parseInt(oldFavPOIList[i]);
                if (tmpPOI === pointID) {
                    wasFavorite = true;
                } else {
                    newFavPOIList.push(tmpPOI);
                }
                newFavPOIList = newFavPOIList.filter(function (value) {
                    return !Number.isNaN(value);
                });
            }
            if (!wasFavorite) {
                newFavPOIList.push(pointID);
            }
            newFavPOIList = newFavPOIList.filter(function (value) {
                return !Number.isNaN(value);
            });
            console.log(newFavPOIList);
            $window.sessionStorage.setItem('userFavPOIList', newFavPOIList.toString());
        };

        $scope.initCB = function(id) {
            if (!$rootScope.existsConnectedUser) {
                return false;
            }
            let tmp = $window.sessionStorage.getItem('userFavPOIList');
            let initFavPOIList = tmp.split(",");
            for (let i = 0; i < initFavPOIList.length; i++) {
                let tmpPOI = parseInt(initFavPOIList[i]);
                if (tmpPOI === id) {
                    return true;
                }
            }
            return false;
        };

        $scope.saveFavPOIList = function () {
            let currentPOIListToSave = [...new Set($scope.favPoints.map(x => x.ID))];
            let currentPOIListToSaveString = currentPOIListToSave.toString();
            $http({
                method: "POST",
                url: 'http://localhost:3000/private/setUserSavedPOIList',
                data: {Points: currentPOIListToSaveString},
                headers: {"Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
                    "x-auth-token": $window.sessionStorage.getItem("userToken")}
            }).then(function mySuccess(response) {
                console.log("SUCCESS!");
                window.alert("Favorites List Saved!");
                // let resultData = response.data[0];
            }, function myError(response) {
                console.log(response);
                console.log("FAILURE!");
            });
        };

        $scope.showFavPOIList();

}]);