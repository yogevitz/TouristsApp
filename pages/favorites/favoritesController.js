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

//
// $scope.openPOI = function (id) {
//     $rootScope.pointID = id;
// };
//
// $scope.searchPoints = function () {
//     // console.log("Searching for: " + $scope.searchInput);
//     // [{"ID":1,"Name":"Colosseum","Description":"The Colosseum and the Arch of Constantine",
//     // "Image":"/Colosseum.jpg","CategoryID":4,"Viewers":30,"Rankers":20,"AverageRank":4.2}]
//     if ($scope.searchInput == null || $scope.searchInput === "") {
//         $scope.noFavorites = false;
//         $scope.getUserFavPOIList();
//     } else {
//         $http({
//             method: "GET",
//             url: 'http://localhost:3000/private/getUserFavPOIListByName/' + $scope.searchInput,
//             headers: {"Access-Control-Allow-Origin": "*",
//                 "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
//                 "x-auth-token": $window.sessionStorage.getItem("userToken")}
//         }).then(function mySuccess(response) {
//             console.log("SUCCESS!");
//             $scope.results = response.data;
//             if (response.data.length === 0) {
//                 $scope.noFavorites = true;
//             } else {
//                 $scope.noFavorites = false;
//             }
//             $scope.searchResultsPoints = response.data;
//             $scope.searchResultsCategories = [];
//             $scope.searchResultsCategories = [...new Set($scope.searchResultsPoints.map(x => x.CategoryID))];
//             $scope.searchResultsCategoriesNames = [];
//             for (let i = 0; i < $scope.searchResultsCategories.length; i++) {
//                 $scope.addCategoryName(i, $scope.searchResultsCategories[i]);
//             }
//         }, function myError(response) {
//             // debugger;
//             console.log(response);
//             console.log(response.data);
//             console.log("FAILURE!");
//             $scope.myWelcome = response.statusText;
//         });
//     }
// };
//
// $scope.addCategoryName = function (i, id) {
//     $http({
//         method: "GET",
//         url: 'http://localhost:3000/getCategoryNameByCategoryID/' + id,
//         headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
//     }).then(function mySuccess(response) {
//         let catData = response.data[0];
//         $scope.searchResultsCategoriesNames.push({ID: id, Name: catData.Name});
//     }, function myError(response) {
//         // debugger;
//         console.log(response);
//         console.log(response.data);
//         console.log("FAILURE!");
//         $scope.myWelcome = response.statusText;
//     });
// };
//
// $scope.getUserFavPOIList = function () {
//     $http({
//         method: "GET",
//         url: 'http://localhost:3000/private/getUserFavPOIList',
//         headers: {"Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept",
//             "x-auth-token": $window.sessionStorage.getItem("userToken")}
//     }).then(function mySuccess(response) {
//         console.log("SUCCESS!");
//         $scope.results = response.data;
//         $scope.searchResultsPoints = response.data;
//         $scope.searchResultsCategories = [];
//         $scope.searchResultsCategories = [...new Set($scope.searchResultsPoints.map(x => x.CategoryID))];
//         $scope.searchResultsCategoriesNames = [];
//         for (let i = 0; i < $scope.searchResultsCategories.length; i++) {
//             $scope.addCategoryName(i, $scope.searchResultsCategories[i]);
//         }
//     }, function myError(response) {
//         // debugger;
//         console.log(response);
//         console.log(response.data);
//         console.log("FAILURE!");
//         $scope.myWelcome = response.statusText;
//     });
// };
//
// $scope.openImage = function () {
//     $http({
//         method: "GET",
//         url: 'http://localhost:3000/getPOIInfo/' + $rootScope.pointID,
//         headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
//     }).then(function mySuccess(response) {
//         console.log("SUCCESS!");
//         let pointData = response.data[0];
//         $scope.pointName = pointData["Name"];
//         $scope.pointImage = "images" + pointData["Image"];
//         $scope.pointDescription = pointData["Description"];
//         $scope.pointRankers = pointData["Rankers"];
//         $scope.pointAverageRank = pointData["AverageRank"];
//         $scope.pointViewers = pointData["Viewers"];
//     }, function myError(response) {
//         // debugger;
//         console.log(response);
//         console.log(response.data);
//         console.log("FAILURE!");
//         $scope.myWelcome = response.statusText;
//     });
//
//     $http({
//         method: "GET",
//         url: 'http://localhost:3000/getPOI2RecentReviews/' + $rootScope.pointID,
//         headers: {"Access-Control-Allow-Origin": "*","Access-Control-Allow-Headers": "Origin, X-Requested-With,Content-Type, Accept"}
//     }).then(function mySuccess(response) {
//         console.log("SUCCESS!");
//         let pointReview1Data, pointReview2Data;
//         $scope.review1Exists = false;
//         $scope.review2Exists = false;
//         $scope.noReviews = false;
//         if (response.data[0] != null) {
//             $scope.review1Exists = true;
//             pointReview1Data = response.data[0];
//             $scope.pointReview1Rank = pointReview1Data["Rank"];
//             $scope.pointReview1Text = pointReview1Data["Text"];
//             $scope.pointReview1Date = pointReview1Data["Date"].split("T")[0];
//             if (response.data[1] != null) {
//                 $scope.review2Exists = true;
//                 pointReview2Data = response.data[1];
//                 $scope.pointReview2Rank = pointReview2Data["Rank"];
//                 $scope.pointReview2Text = pointReview2Data["Text"];
//                 $scope.pointReview2Date = pointReview2Data["Date"].split("T")[0];
//             }
//         } else {
//             $scope.noReviews = true;
//         }
//     }, function myError(response) {
//         // debugger;
//         console.log(response);
//         console.log(response.data);
//         console.log("FAILURE!");
//         $scope.myWelcome = response.statusText;
//     });
// };

// $scope.searchPoints();