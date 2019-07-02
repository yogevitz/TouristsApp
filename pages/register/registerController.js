// register controller
angular.module("myApp")
    .controller("registerController", function ($scope, $http) {
        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];

        $scope.countries = [
            "Australia",
            "Bolivia",
            "China",
            "Denemark",
            "Israel",
            "Latvia",
            "Monaco",
            "August",
            "Norway",
            "Panama",
            "Switzerland",
            "USA"
        ];

        $scope.categories = [
            { id: 1, name: "Food" },
            { id: 2, name: "Sport" },
            { id: 3, name: "Museums" },
            { id: 4, name: "Culture" },
            { id: 5, name: "Nature" },
            { id: 6, name: "Art" }
        ];

        $scope.selectedCategories = [];
        var registerData = {};
        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];
        let vm = this;
        vm.question1List = '';
        vm.question2List = '';

        function checkRegister() {
            if ($scope.selectedCategories.filter(Boolean).length < 2) {
                alert("Please choose at least 2 categories");
                return false;
            } else {
                return true;
            }
        }

        $scope.register = function () {
            console.log("IDO1");
            if (checkRegister()){
                var ansList = [];
                let firstQuestion = $scope.questions.indexOf($scope.vm.question1List) + 1;
                let firstAns = $scope.firstAnswer;
                ansList[0] = {"QuestionID": firstQuestion, "Answer": firstAns};
                let secondQuestion = $scope.questions.indexOf($scope.vm.question2List) + 1;
                let secondAns = $scope.secondAnswer;
                ansList[1] = {"QuestionID": secondQuestion, "Answer": secondAns};
                var categories = [];
                var j = 0;
                for (var i=0; i < $scope.selectedCategories.length; i++){
                    if($scope.selectedCategories[i]){
                        categories[j] = i;
                        j++;
                    }
                }
                // use $.param jQuery function to serialize data from JSON
                let registerData = {
                    UserName: $scope.userName,
                    Password: $scope.psw,
                    FirstName: $scope.firstName,
                    LastName: $scope.lastName,
                    City: $scope.city,
                    CountryID: $scope.countries.indexOf($scope.country) + 1,
                    Email: $scope.email,
                    CategoriesList: categories,
                    AnswersList: ansList
                };


                console.log("IDO2");


                $http({
                    method: "POST",
                    url: 'http://localhost:3000/register',
                    data: registerData
                }).then(function a(response) {
                    console.log("IDO3");
                }, function b(response) {
                    console.log("IDO5");
                });

                window.location.href = "#!login";


                //
                // console.log("IDO2");
                // $http.post('http://localhost:3000/register', registerData)
                //     .then(function (response) {
                //         console.log("IDO3");
                //         if (response.data === "Failed.") {
                //             console.log("IDO5");
                //             window.alert("Registered Failed.");
                //         } else {
                //             console.log("IDO4");
                //             // $scope.PostDataResponse = response.data;
                //             // $rootScope.userToken = response.data;
                //             $scope.PostDataResponse = registerData.data;
                //             console.log("SUCCESS REGISTRATION!");
                //             window.location.href = "#!login"
                //         }
                //     }
                //     ,(function () {
                //         console.log("IDO6");
                //         console.log("FAILURE REGISTRATION!");
                //         $scope.ResponseDetails = "invalid registration "
                //     }));
            }
            else {

            }
        };

    });


angular.module("myApp").filter('excludeUsed', function() {
    var filter = function(items, excludeVal1, excludeVal2) {
        var checkItem = function(item) {
            return (item != excludeVal1) && (item != excludeVal2);
        };

        return items.filter(checkItem);
    };

    return filter;
});

//
// INSERT INTO Users" +
// "(ID,UserName,Password,FirstName,LastName,City,CountryID,Email,Admin)
// INSERT INTO UsersCategories" +
//         "(UserID,CategoryID)
// INSERT INTO UsersQuestionsAnswers" +
//         "(UserID,QuestionID,Answer)
// angular.module("myApp")
//     .controller("registerController", function ($scope, $http) {
//
//
// });