
angular.module("myApp")
    .controller("restorePasswordController", function ($scope, $http) {
        $scope.questions = [
            "The name of your first dog",
            "The name of your 3rd grade teacher",
            "The name of your favorite book",
            "The name of your favorite restaurant"
        ];

        let vm = this;
        vm.questionsFullList = '';
        vm.question1List = '';
        vm.question1List = '';

        $scope.restorePassword = function () {
            var ansList = [];
            let firstQuestion = $scope.questions.indexOf($scope.vm.question1List) + 1;
            let firstAns = $scope.firstAnswer;
            ansList[0] = {"QuestionID": firstQuestion, "Answer": firstAns};
            let secondQuestion = $scope.questions.indexOf($scope.vm.question2List) + 1;
            let secondAns = $scope.secondAnswer;
            ansList[1] = {"QuestionID": secondQuestion, "Answer": secondAns};
            var restoreUser = {
                UserName: $scope.userName,
                AnswersList: ansList
            };

            $http.post('http://localhost:3000/restorePassword', restoreUser)
                .then(function (response){
                        if (response.data === "Invalid Question/Answer.")
                            window.alert("User Name or Question or Answer Are Invalid");
                        else {
                            $scope.content = response.data;
                            let password = response.data["Password"];
                            window.alert("Your Password is: " + password);
                            window.location.href = "#!login";
                        }
                    }
                    ,(function () {
                        console.log("FAILURE LOGIN!");
                        window.alert("User Name Or Password Are Invalid");
                        $scope.ResponseDetails = "invalid login";
                    }));
        }
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

